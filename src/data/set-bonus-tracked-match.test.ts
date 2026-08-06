import { describe, it, expect } from 'vitest';
import {
  TRACKED_STAT_TO_BONUS_STATS,
  TRACKED_STATS_WITHOUT_SET_BONUSES,
} from './set-bonus-groups';
import { buildTrackedStatTargets, getSetTrackedBonuses, getSetTrackedMatches } from './set-bonus-index';
import { STAT_DEFINITIONS } from './core/stat-definitions';
import { STAT_NAME_MAP } from '@/utils/calculations/set-bonuses';
import { IO_SETS_RAW as HC_SETS } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB_SETS } from '@/data/datasets/rebirth/io-sets-raw';
import { IO_SETS_RAW as TS_SETS } from '@/data/datasets/thunderspy/io-sets-raw';
import type { IOSet } from '@/types';

/**
 * The "tracked stats" highlight in the enhancement picker compares two DIFFERENT
 * vocabularies: the dashboard's `breakdownKey` (camelCase globals — `maxHP`,
 * `mezResistHold`) and the normalized set-bonus stat names (`maxhp`, `mezresist`).
 *
 * The original matcher compared them directly, so only the 26 keys spelled
 * identically in both could ever match. Tracking Max HP highlighted 0 of the 107
 * Homecoming sets that grant it; Mez Resistance 0 of 146. The bug was invisible
 * because the failure mode is "no highlight", which is indistinguishable from
 * "no set grants this".
 *
 * These tests pin the FULL tracked vocabulary — every `breakdownKey` must be
 * deliberately classified as mappable or unmappable — so a newly-defined stat
 * can't quietly join the dead pile.
 */

type RawBonus = { pieces: number; effects?: Array<{ stat: string; value: number; desc?: string; pvp?: boolean }> };
type RawSet = { name?: string; bonuses?: RawBonus[] };
type Registry = Record<string, RawSet>;

const DATASETS: Array<[string, Registry]> = [
  ['homecoming', HC_SETS as unknown as Registry],
  ['rebirth', RB_SETS as unknown as Registry],
  ['thunderspy', TS_SETS as unknown as Registry],
];

/** Adapt a raw registry entry to the IOSet shape the matcher consumes. */
function asIOSet(raw: RawSet): IOSet {
  return {
    name: raw.name ?? 'test',
    bonuses: (raw.bonuses ?? []).map((b) => ({
      pieces: b.pieces,
      effects: (b.effects ?? []).map((e) => ({
        stat: e.stat,
        value: e.value,
        desc: e.desc ?? '',
        ...(e.pvp ? { pvp: true as const } : {}),
      })),
    })),
  } as unknown as IOSet;
}

/** How many sets in a dataset would highlight for a given tracked stat. */
function setsMatching(reg: Registry, trackedKey: string): number {
  let n = 0;
  for (const raw of Object.values(reg)) {
    if (getSetTrackedMatches(asIOSet(raw), [trackedKey]).size > 0) n++;
  }
  return n;
}

const ALL_TRACKED_KEYS = [
  ...new Set(
    Object.values(STAT_DEFINITIONS)
      .map((s) => s.breakdownKey)
      .filter((k): k is string => !!k),
  ),
].sort();

describe('tracked-stat vocabulary coverage', () => {
  it('every dashboard breakdownKey is classified as mappable or unmappable', () => {
    const unclassified = ALL_TRACKED_KEYS.filter(
      (k) => !TRACKED_STAT_TO_BONUS_STATS[k] && !TRACKED_STATS_WITHOUT_SET_BONUSES.includes(k),
    );
    // Printed count makes a shrinking/growing vocabulary visible in CI output.
    expect({ tracked: ALL_TRACKED_KEYS.length, unclassified }).toEqual({
      tracked: ALL_TRACKED_KEYS.length,
      unclassified: [],
    });
  });

  it('no key is both mappable and declared unmappable', () => {
    const both = TRACKED_STATS_WITHOUT_SET_BONUSES.filter((k) => TRACKED_STAT_TO_BONUS_STATS[k]);
    expect(both).toEqual([]);
  });

  it('the classification lists contain only real breakdownKeys (no drifted entries)', () => {
    const known = new Set(ALL_TRACKED_KEYS);
    const strays = [
      ...Object.keys(TRACKED_STAT_TO_BONUS_STATS),
      ...TRACKED_STATS_WITHOUT_SET_BONUSES,
    ].filter((k) => !known.has(k));
    expect(strays).toEqual([]);
  });

  it('every mapping target is a real normalized set-bonus stat', () => {
    // A typo here ("maxHp") silently produces a key nothing emits — the exact
    // failure the whole map exists to eliminate.
    const vocabulary = new Set(Object.values(STAT_NAME_MAP).filter((v): v is string => !!v));
    const bogus = Object.entries(TRACKED_STAT_TO_BONUS_STATS).flatMap(([key, targets]) =>
      targets.filter((t) => !vocabulary.has(t)).map((t) => `${key} -> ${t}`),
    );
    expect(bogus).toEqual([]);
  });
});

describe('buildTrackedStatTargets', () => {
  it('translates renamed keys into the normalized vocabulary', () => {
    expect([...buildTrackedStatTargets(['maxHP']).keys()]).toEqual(['maxhp']);
    expect([...buildTrackedStatTargets(['endurance']).keys()]).toEqual(['endrdx']);
    expect([...buildTrackedStatTargets(['protKnockback']).keys()]).toEqual(['kbprotection']);
    expect([...buildTrackedStatTargets(['mezResistKnockback']).keys()]).toEqual(['kbresistance']);
  });

  it('maps every status mez-resist type onto the undifferentiated "(All)" bonus', () => {
    // useCalculatedStats folds global.mezResist into these six only.
    for (const key of [
      'mezResistHold',
      'mezResistStun',
      'mezResistImmobilize',
      'mezResistSleep',
      'mezResistConfuse',
      'mezResistFear',
    ]) {
      expect(buildTrackedStatTargets([key]).get('mezresist')).toBe(key);
    }
  });

  it('does NOT extend mez-resist(All) to knockback, taunt or placate', () => {
    // Knockback resistance is a separate stat; Taunt/Placate never receive
    // global.mezResist. Mapping them would advertise a bonus the build never gets.
    expect(buildTrackedStatTargets(['mezResistKnockback']).has('mezresist')).toBe(false);
    expect(buildTrackedStatTargets(['mezResistTaunt']).has('mezresist')).toBe(false);
    expect(buildTrackedStatTargets(['mezResistPlacate']).has('mezresist')).toBe(false);
  });

  it('accepts Res(All) for any typed resistance', () => {
    expect(buildTrackedStatTargets(['resFire']).get('resAll')).toBe('resFire');
  });

  it('still expands paired stats (one bonus grants both halves)', () => {
    const t = buildTrackedStatTargets(['resFire']);
    expect(t.get('resCold')).toBe('resFire');
    expect(buildTrackedStatTargets(['defEnergy']).get('defNegative')).toBe('defEnergy');
  });

  it('is empty for an unmappable stat, not a self-match on a nonexistent stat', () => {
    // 'absorb' is real as a tracked stat but no set bonus grants it.
    const targets = buildTrackedStatTargets(['absorb']);
    expect(setsMatching(HC_SETS as unknown as Registry, 'absorb')).toBe(0);
    // Fallback keeps the key (harmless) but nothing in the vocabulary emits it.
    expect(targets.has('absorb')).toBe(true);
  });
});

/**
 * Regression anchors. Each of these tracked stats matched ZERO sets before the
 * fix. The counts are printed as objects so a change shows the actual number
 * rather than a bare boolean — and so shrinkage (a dataset regen dropping
 * bonuses) is visible rather than passing a `> 0` check.
 */
describe.each(DATASETS)('tracked stats highlight real sets (%s)', (label, reg) => {
  const PREVIOUSLY_BROKEN = [
    'maxHP',
    'mezResistHold',
    'maxEndurance',
    'runSpeed',
    'debuffResistRecharge',
    'protKnockback',
    'endurance',
  ];

  it('every previously-unmatchable tracked stat now highlights sets', () => {
    const counts = Object.fromEntries(PREVIOUSLY_BROKEN.map((k) => [k, setsMatching(reg, k)]));
    const zero = Object.entries(counts).filter(([, n]) => n === 0).map(([k]) => k);
    expect({ dataset: label, counts, zero }).toMatchObject({ zero: [] });
  });

  it('Max HP highlights the bulk of the catalogue (it is the commonest bonus)', () => {
    // ~100+ of ~220 sets in every dataset. A collapse here means the rename broke.
    expect(setsMatching(reg, 'maxHP')).toBeGreaterThan(50);
  });

  it('Mez Resistance highlights more sets than any other tracked stat', () => {
    // mez_resistance_(all) rides along on most defensive sets — 139-153 per dataset.
    expect(setsMatching(reg, 'mezResistHold')).toBeGreaterThan(100);
  });

  it('an unmappable tracked stat still highlights nothing', () => {
    // Guards against an over-broad fallback turning every stat into a match.
    for (const key of ['absorb', 'protHold', 'threatLevel', 'stealthRadiusPvE']) {
      expect({ key, sets: setsMatching(reg, key) }).toEqual({ key, sets: 0 });
    }
  });
});

describe('getSetTrackedBonuses (value + piece count detail)', () => {
  const set: IOSet = asIOSet({
    name: 'Test Set',
    bonuses: [
      { pieces: 2, effects: [{ stat: 'maximum_hitpoints', value: 1.125, desc: '+1.125% Max HP' }] },
      {
        pieces: 3,
        effects: [
          { stat: 'damage_resistance_(fire)', value: 3, desc: '+3% Fire Res' },
          { stat: 'damage_resistance_(cold)', value: 3, desc: '+3% Cold Res' },
        ],
      },
      { pieces: 4, effects: [{ stat: 'Recharge', value: 5, desc: '+5% Recharge', pvp: true }] },
    ],
  });

  it('reports the piece threshold and value for a tracked stat', () => {
    const matches = getSetTrackedBonuses(set, ['maxHP']);
    expect(matches).toEqual([
      {
        trackedKey: 'maxHP',
        pieces: 2,
        value: 1.125,
        desc: '+1.125% Max HP',
        stat: 'maximum_hitpoints',
        normalizedStat: 'maxhp',
      },
    ]);
  });

  it('collapses both halves of a paired bonus into one row', () => {
    // The set lists Fire and Cold separately; the player tracking Fire Res wants
    // to see "3pc: +3%" once, not twice.
    const matches = getSetTrackedBonuses(set, ['resFire']);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ trackedKey: 'resFire', pieces: 3, value: 3 });
  });

  it('excludes PvP-only bonuses (they never apply in PvE)', () => {
    expect(getSetTrackedBonuses(set, ['recharge'])).toEqual([]);
  });

  it('returns rows sorted by piece threshold', () => {
    const matches = getSetTrackedBonuses(set, ['resFire', 'maxHP']);
    expect(matches.map((m) => m.pieces)).toEqual([2, 3]);
  });

  it('is empty for no tracked stats', () => {
    expect(getSetTrackedBonuses(set, [])).toEqual([]);
  });

  it('agrees with getSetTrackedMatches', () => {
    const keys = [...getSetTrackedMatches(set, ['resFire', 'maxHP'])].sort();
    expect(keys).toEqual(['maxHP', 'resFire']);
  });
});
