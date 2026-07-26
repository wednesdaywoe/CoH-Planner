import { describe, it, expect } from 'vitest';
import { STAT_GROUP_INFO, SET_BONUS_GROUP_ORDER, PROC_BREAKDOWN_KEY_TO_GROUP_KEY, statKeyToLabel, toCanonicalStatKey, isOverCapMuted } from './set-bonus-groups';
import { STAT_NAME_MAP } from '@/utils/calculations/set-bonuses';

/**
 * The Set Bonus Totals popup groups bonuses by their NORMALIZED stat name
 * (the value side of STAT_NAME_MAP). Any normalized stat the engine can emit
 * must have a STAT_GROUP_INFO entry, or it silently lands in "Misc" — the exact
 * bug that dumped every defense/resistance bonus into "Other".
 */
describe('Set bonus group coverage', () => {
  // Normalized values that aren't real bonus stats and never reach the popup.
  const NON_BONUS = new Set(['io-set']);

  it('every normalized set-bonus stat has a group + label', () => {
    const normalized = new Set(
      Object.values(STAT_NAME_MAP).filter((v): v is string => !!v && !NON_BONUS.has(v))
    );
    const uncategorized = [...normalized].filter((stat) => !STAT_GROUP_INFO[stat]);
    expect(uncategorized).toEqual([]);
  });

  it('every group is listed in the display order', () => {
    const order = new Set(SET_BONUS_GROUP_ORDER);
    const missing = Object.values(STAT_GROUP_INFO)
      .map((i) => i.group)
      .filter((g) => !order.has(g));
    expect([...new Set(missing)]).toEqual([]);
  });

  it('paired defense/resistance stats share a label so they dedupe to one row', () => {
    // E/N, F/C, S/L pairs must collapse to a single row per group.
    expect(STAT_GROUP_INFO.defEnergy.label).toBe(STAT_GROUP_INFO.defNegative.label);
    expect(STAT_GROUP_INFO.defFire.label).toBe(STAT_GROUP_INFO.defCold.label);
    expect(STAT_GROUP_INFO.resSmashing.label).toBe(STAT_GROUP_INFO.resLethal.label);
  });

  // The popup folds always-on proc globals (LotG +Recharge, +Def(All), Kismet
  // +ToHit, …) into its rows by mapping dashboard breakdown keys → group keys.
  // A typo in the target key would silently dump the proc into "Misc".
  it('every proc breakdown→group target key is a real STAT_GROUP_INFO entry', () => {
    const unmapped = Object.values(PROC_BREAKDOWN_KEY_TO_GROUP_KEY).filter(
      (groupKey) => !STAT_GROUP_INFO[groupKey]
    );
    expect(unmapped).toEqual([]);
  });

  it('LotG +Recharge lands in the General · Recharge row', () => {
    // The breakdown emits proc recharge under the `recharge` key; it must map to
    // the same row the set-bonus recharge totals use.
    const groupKey = PROC_BREAKDOWN_KEY_TO_GROUP_KEY.recharge;
    expect(groupKey).toBe('recharge');
    expect(STAT_GROUP_INFO[groupKey]).toEqual({ group: 'General', label: 'Recharge' });
  });
});

/**
 * statKeyToLabel resolves dashboard breakdown keys (camelCase global keys) to
 * the Set Bonus Totals label — the crux of the Rule-of-5 ring tooltip naming
 * *which* bonus is capped. The breakdown and the grouping table disagree on
 * casing for some stats (mezResist↔mezresist, maxHP↔maxhp), so both forms must
 * resolve. The mez case is the one the user-reported confusion hinges on.
 */
describe('statKeyToLabel (Rule-of-5 ring tooltip)', () => {
  it('resolves the hidden bundled Mez Resistance component users get tripped up by', () => {
    expect(statKeyToLabel('mezResist')).toBe('Mez Resistance');
  });

  it('resolves both camelCase-global and already-lowercase breakdown keys', () => {
    expect(statKeyToLabel('maxHP')).toBe('Max HP');
    expect(statKeyToLabel('toHit')).toBe('ToHit');
    expect(statKeyToLabel('resFire')).toBe(STAT_GROUP_INFO.resFire.label);
    expect(statKeyToLabel('defMelee')).toBe('Melee');
  });

  it('falls back to the raw key rather than dropping an unknown stat', () => {
    expect(statKeyToLabel('someFutureStat')).toBe('someFutureStat');
  });
});

describe('over-cap mute canonicalization', () => {
  it('collapses a paired defense stat to one key (defEnergy === defNegative)', () => {
    expect(toCanonicalStatKey('defEnergy')).toBe(toCanonicalStatKey('defNegative'));
    expect(toCanonicalStatKey('resSmashing')).toBe(toCanonicalStatKey('resLethal'));
    expect(toCanonicalStatKey('defFire')).toBe(toCanonicalStatKey('defCold'));
  });

  it('does NOT collapse across groups (defense E/N !== resistance E/N)', () => {
    expect(toCanonicalStatKey('defEnergy')).not.toBe(toCanonicalStatKey('resEnergy'));
  });

  it('write vocabulary (popup row.stat) and read vocabulary (breakdown key) agree', () => {
    // mez: popup emits 'mezresist', breakdown emits 'mezResist'
    expect(toCanonicalStatKey('mezresist')).toBe(toCanonicalStatKey('mezResist'));
    // maxHP: popup 'maxhp', breakdown 'maxHP'
    expect(toCanonicalStatKey('maxhp')).toBe(toCanonicalStatKey('maxHP'));
    // toHit: popup 'tohit', breakdown 'toHit'
    expect(toCanonicalStatKey('tohit')).toBe(toCanonicalStatKey('toHit'));
  });

  it('isOverCapMuted round-trips a popup mute onto BOTH breakdown halves of a pair', () => {
    // Player mutes the "Energy/Negative" Defense popup row; row.stat may be either half.
    const muted = [toCanonicalStatKey('defEnergy')];
    expect(isOverCapMuted('defEnergy', muted)).toBe(true);
    expect(isOverCapMuted('defNegative', muted)).toBe(true); // the key the bare-stat approach would miss
  });

  it('isOverCapMuted does not leak a defense mute onto resistance', () => {
    const muted = [toCanonicalStatKey('defEnergy')];
    expect(isOverCapMuted('resEnergy', muted)).toBe(false);
  });

  it('isOverCapMuted is false for an empty mute set', () => {
    expect(isOverCapMuted('mezResist', [])).toBe(false);
  });

  it('falls an unmapped exotic stat into a stable misc token (case-insensitive; read/write agree)', () => {
    // Not present in STAT_GROUP_INFO or PROC_BREAKDOWN_KEY_TO_GROUP_KEY.
    expect(toCanonicalStatKey('someExoticStat').startsWith('misc|')).toBe(true);
    // write vs read vocabularies (case difference) still agree for an exotic key
    expect(toCanonicalStatKey('SomeExoticStat')).toBe(toCanonicalStatKey('someexoticstat'));
    // a digit-bearing unmapped key must NOT collapse onto a real mapped stat
    expect(toCanonicalStatKey('damage2')).not.toBe(toCanonicalStatKey('damage'));
  });

  it('agrees on write (tracking) vs read (breakdown global) key for divergent-global set bonuses', () => {
    // These three set-bonus stats have breakdown/global keys renamed beyond case
    // (STAT_TO_GLOBAL in legacy-totals.oracle.ts). Muting from the popup (tracking key)
    // must suppress the ring/banner (breakdown global key).
    expect(toCanonicalStatKey('maxEndurance')).toBe(toCanonicalStatKey('maxend'));
    expect(toCanonicalStatKey('endurance')).toBe(toCanonicalStatKey('endrdx'));
    expect(toCanonicalStatKey('mezResistKnockback')).toBe(toCanonicalStatKey('kbresistance'));
    // and none of them fall into the misc bucket
    expect(toCanonicalStatKey('maxEndurance').startsWith('misc|')).toBe(false);
  });

  it('a popup mute of Max Endurance suppresses the breakdown-key ring/banner', () => {
    const muted = [toCanonicalStatKey('maxend')]; // what the popup bell stores
    expect(isOverCapMuted('maxEndurance', muted)).toBe(true); // breakdown key the ring reads
  });

  it('is idempotent — applying it to an already-canonical key returns it unchanged', () => {
    // The write path canonicalizes TWICE (the popup passes toCanonicalStatKey(row.stat)
    // AND the store re-canonicalizes). If the function is not idempotent, the stored
    // value ('misc|<mash>') never matches what the read side computes ('group|label'),
    // and NO warning is ever suppressed. Guards that double-application is harmless.
    for (const raw of ['mezresist', 'defEnergy', 'resSmashing', 'maxend', 'someExoticStat']) {
      const once = toCanonicalStatKey(raw);
      expect(toCanonicalStatKey(once)).toBe(once);
    }
    // end-to-end: even a double-canonicalized store value still suppresses the breakdown key
    const doubled = toCanonicalStatKey(toCanonicalStatKey('mezresist'));
    expect(isOverCapMuted('mezResist', [doubled])).toBe(true);
  });
});
