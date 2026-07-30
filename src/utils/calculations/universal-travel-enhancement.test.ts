import { describe, it, expect, beforeAll } from 'vitest';
import { calculateCharacterTotals } from './character-totals';
import { parseIOSetPieceValues } from './enhancement-values';
import { createEmptyBuild } from '@/types/build';
import { getPowerPool } from '@/data/power-pools';
import { loadDataset } from '@/data/dataset';
import { IO_SETS_RAW as HC } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as REBIRTH } from '@/data/datasets/rebirth/io-sets-raw';
import { IO_SETS_RAW as TSPY } from '@/data/datasets/thunderspy/io-sets-raw';

/**
 * "Universal Travel" pieces must actually enhance travel.
 *
 * Reported 2026-07-30 against Winter's Gift: "it doesn't seem to actually be giving
 * any Run Speed enhancement value." Root cause was a vocabulary hole, not a routing
 * bug: the extractor labels the travel bundle `"Move Speed"`
 * (`HC_PIECE_ASPECT_OVERRIDES` in scripts/extract-rebirth-io-sets-v2.py), and that
 * string was in neither `ASPECT_NAME_MAP` nor the Rust `normalize_aspect_name`. Both
 * engines silently `continue`d past it, so the aspect contributed nothing at all —
 * and the picker rendered a "Move Speed" row with the value omitted.
 *
 * Blessing of the Zephyr carries the identical aspect and was equally broken.
 *
 * The authoritative shape is `exported_powers/boosts/crafted_winters_gift_a`, whose
 * in-game piece name is "Run Speed, Jump, Flight Speed, Range":
 *
 *   ['RunningSpeed','FlyingSpeed','JumpingSpeed']  Melee_Boosts_33 (Sched A)  1.0
 *   ['JumpHeight']                                 Melee_Boosts_33 (Sched A)  1.0
 *   ['Range']                                      Melee_Boosts_20 (Sched B)  1.0
 *
 * — ONE aspect slot granting all of it, which is why `scale` is the plain 1-slot
 * modifier. The Endurance piece carries 0.625 (the 2-slot rate) on all four templates.
 */

const TRAVEL_SETS = ['winters_gift', 'blessing_of_the_zephyr'] as const;

describe('Universal Travel aspect ("Move Speed") — data shape', () => {
  it.each([
    ['homecoming', HC],
    ['rebirth', REBIRTH],
    ['thunderspy', TSPY],
  ] as const)('%s still labels the bundle "Move Speed" on both travel sets', (_dataset, sets) => {
    // If the extractor is ever fixed to emit the real in-game aspect names, this
    // fails loudly rather than the fan-out quietly becoming dead code.
    for (const id of TRAVEL_SETS) {
      const set = sets[id];
      expect(set, `${id} missing`).toBeDefined();
      const travelPieces = set.pieces.filter((p) => p.aspects.includes('Move Speed'));
      expect(travelPieces.length, `${id} should have 2 travel pieces`).toBe(2);
    }
  });
});

describe('Universal Travel aspect — enhancement values', () => {
  it('a one-slot travel piece enhances run, fly, jump AND range', () => {
    const bonuses = parseIOSetPieceValues(['Move Speed'], 50, false, undefined, 'Move Speed');
    // Schedule A for the travel modes, Schedule B for Range — the two tables in the
    // export. Non-zero is the actual regression; the ratio pins the schedule split.
    for (const key of ['run', 'fly', 'jump', 'range']) {
      expect(bonuses[key], `${key} should be enhanced`).toBeGreaterThan(0);
    }
    expect(bonuses.run).toBe(bonuses.fly);
    expect(bonuses.run).toBe(bonuses.jump);
    expect(bonuses.range).toBeLessThan(bonuses.run!); // B < A
  });

  it('the travel bundle counts as ONE aspect slot, so a second aspect applies the 2-slot rate', () => {
    const solo = parseIOSetPieceValues(['Move Speed'], 50, false, undefined, 'Move Speed');
    const duo = parseIOSetPieceValues(
      ['Endurance', 'Move Speed'],
      50,
      false,
      undefined,
      'Endurance/Move Speed',
    );
    // 0.625 is getMultiAspectModifier(2). If the bundle were counted as four
    // aspects, the piece would land on the 4+ rate (0.4375) instead.
    expect(duo.run! / solo.run!).toBeCloseTo(0.625, 6);
    expect(duo.endurance).toBeCloseTo(solo.run! * 0.625, 6);
  });
});

describe('Universal Travel aspect — reaches character totals via the live engine', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyBuild = any;

  const buildWithSuperSpeed = (slots: object[]): AnyBuild => {
    const pool = getPowerPool('speed')!;
    const ss = pool.powers.find((p) => p.internalName === 'Super_Speed')!;
    const b: AnyBuild = createEmptyBuild();
    b.serverId = 'homecoming';
    b.level = 50;
    b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null };
    b.pools = [
      {
        id: 'speed',
        name: 'speed',
        powers: [{ ...ss, powerSet: 'speed', level: 1, isActive: true, slots }],
      },
    ];
    b.inherents = [];
    return b;
  };

  const travelSlot = () => ({
    type: 'io-set' as const,
    id: 'winters_gift-0',
    name: 'Move Speed',
    setName: "Winter's Gift",
    setId: 'winters_gift',
    pieceNum: 1,
    level: 50,
    attuned: false,
    aspects: ['Move Speed'],
    isProc: false,
    isUnique: false,
    icon: 'SEO_Winters_Gift.png',
  });

  const runSpeedOf = (b: AnyBuild) =>
    calculateCharacterTotals(b, false, undefined, { combatMode: false }).globalBonuses.runSpeed;

  it("a slotted Winter's Gift travel piece raises Super Speed's run buff", () => {
    const bare = runSpeedOf(buildWithSuperSpeed([]));
    const slotted = runSpeedOf(buildWithSuperSpeed([travelSlot()]));

    // Super Speed unenhanced is +350% (Melee_SpeedRunning 3.5 × 1.0).
    expect(bare).toBeCloseTo(350, 0);
    // One L50 Schedule-A IO is +42.4%, which is under the ED knee, so it applies
    // in full: 350 × 1.424 ≈ 498. The regression this guards is `slotted === bare`
    // — the aspect contributing nothing at all.
    expect(slotted).toBeGreaterThan(bare + 100);
    expect(slotted).toBeCloseTo(498.3, 0);
    expect(slotted / bare).toBeCloseTo(1.424, 2);
  });
});
