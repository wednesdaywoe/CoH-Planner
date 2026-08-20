// MUST be first: the store caches its persist storage at module-eval time.
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getAllIOSets } from '@/data/io-sets';
import { createIOSetEnhancement, createGenericIOEnhancement, createOriginEnhancement } from '@/data/enhancement-registry';
import { useBuildStore } from '@/stores/buildStore';
import { createEmptyBuild } from '@/types/build';
import type { Enhancement, IOSet, IOSetPiece, SelectedPower } from '@/types';

/**
 * The picker's level-offset spinner is a PLACEMENT default: it is stamped into
 * an enhancement when the picker mints it, and nothing revisits a slot after.
 * Reported 2026-08-18 against 0.1.9.3-beta — a Scrapper's max HP read 2376 to
 * the game's 2397. His saved build carried `globalBoostLevel: 5` in UI state
 * and boost 0 on all 94 slots: he set +5 after slotting, so it reached nothing.
 * The picker now offers "Apply to slotted", which runs the same store action
 * the Enhancement Tools modal does.
 *
 * These grade the store action, since that is where the rules live. The
 * important one is the last: the bulk path and the PLACEMENT path must decide
 * eligibility the same way, or a piece carries a boost or not depending on
 * which one last touched it. It is graded by asking the factory — the code the
 * picker actually calls — rather than by restating its rule here.
 */

const B = 5;

let normalPiece: { set: IOSet; piece: IOSetPiece; index: number };
let procPiece: { set: IOSet; piece: IOSetPiece; index: number };
/** A magnitude piece from a set that can be crafted below 50 — the sub-50 case
 *  needs its own set, because the one carrying a pure proc need not have one. */
let lowPiece: { set: IOSet; piece: IOSetPiece; index: number };

beforeAll(async () => {
  await loadDataset('homecoming');
  // Data-driven: the first set carrying both a magnitude piece and a pure proc
  // (a proc with no aspects — nothing for a booster to scale).
  for (const set of Object.values(getAllIOSets())) {
    const pieces = set.pieces ?? [];
    const proc = pieces.findIndex((p) => p.proc && p.aspects.length === 0);
    const normal = pieces.findIndex((p) => !p.proc && p.aspects.length > 0);
    if (proc >= 0 && normal >= 0) {
      normalPiece = { set, piece: pieces[normal], index: normal };
      procPiece = { set, piece: pieces[proc], index: proc };
      break;
    }
  }
  for (const set of Object.values(getAllIOSets())) {
    const normal = (set.pieces ?? []).findIndex((p) => !p.proc && p.aspects.length > 0);
    if (normal >= 0 && (set.minLevel ?? 50) < 50) {
      lowPiece = { set, piece: set.pieces[normal], index: normal };
      break;
    }
  }
  expect(lowPiece, 'no IO set crafts below 50 — the sub-50 case cannot be exercised').toBeDefined();
  expect(normalPiece, 'no IO set carries both a magnitude piece and a pure proc').toBeDefined();
}, 120000);

/** A build whose one power holds `slots`, installed in the store. */
function install(slots: (Enhancement | null)[]) {
  const build = createEmptyBuild('homecoming');
  build.level = 50;
  build.primary = {
    id: 'x/y',
    name: 'Y',
    powers: [{ name: 'P', internalName: 'P', level: 1, slots } as unknown as SelectedPower],
  };
  useBuildStore.getState()._restoreBuild(build);
}

const slots = () => useBuildStore.getState().build.primary.powers[0].slots;

const ioSet = (level: number, attuned = false, boost?: number) =>
  createIOSetEnhancement(normalPiece.set, normalPiece.piece, normalPiece.index, { attuned, level, boost });
const ioProc = (level: number, boost?: number) =>
  createIOSetEnhancement(procPiece.set, procPiece.piece, procPiece.index, { attuned: false, level, boost });

describe('applying the picker’s level offset to already-slotted enhancements', () => {
  it('boosts the unboosted slots the placement default never reached', () => {
    install([ioSet(50), createGenericIOEnhancement('Accuracy', 50), null]);
    expect(slots().map((s) => s?.boost)).toEqual([undefined, undefined, undefined]);

    const changed = useBuildStore.getState().maximizeEnhancementLevels({ boostLevel: B });

    expect(changed).toBe(2);
    expect(slots().map((s) => s?.boost)).toEqual([B, B, undefined]);
  });

  it('is idempotent — a second application changes nothing and says so', () => {
    install([ioSet(50, false, B)]);
    expect(useBuildStore.getState().maximizeEnhancementLevels({ boostLevel: B })).toBe(0);
  });

  it('reports zero rather than silently doing nothing when no slot is eligible', () => {
    install([ioSet(50, true), ioProc(50)]);
    expect(useBuildStore.getState().maximizeEnhancementLevels({ boostLevel: B })).toBe(0);
    expect(slots().map((s) => s?.boost)).toEqual([undefined, undefined]);
  });

  it('leaves sub-50 IOs alone — a booster is a level-50 combine', () => {
    const low = Math.max(lowPiece.set.minLevel ?? 10, 10);
    install([
      createIOSetEnhancement(lowPiece.set, lowPiece.piece, lowPiece.index, { attuned: false, level: low }),
    ]);
    expect(useBuildStore.getState().maximizeEnhancementLevels({ boostLevel: B })).toBe(0);
    expect(slots()[0]?.boost).toBeUndefined();
  });

  /**
   * The two offsets are different mechanics off different curves, and the
   * picker sends whichever its current tab sits on. Sending the booster option
   * for an origin enhancement would write a combine level onto a relative-level
   * axis; this pins that the origin slot moves only on the relative option.
   */
  it('routes the relative axis to origin and special enhancements only', () => {
    install([createOriginEnhancement('Accuracy', 'SO', 'Natural'), ioSet(50)]);

    expect(useBuildStore.getState().maximizeEnhancementLevels({ boostLevel: B })).toBe(1);
    expect(slots()[0]?.boost).toBeUndefined();
    expect(slots()[1]?.boost).toBe(B);

    expect(useBuildStore.getState().maximizeEnhancementLevels({ relativeLevel: 3 })).toBe(1);
    expect(slots()[0]?.boost).toBe(3);
    expect(slots()[1]?.boost).toBe(B);
  });

  it('agrees with the placement path on which level-50 pieces can carry a boost', () => {
    const cases: [string, Enhancement, Enhancement][] = [
      ['magnitude piece', ioSet(50), ioSet(50, false, B)],
      ['attuned piece', ioSet(50, true), ioSet(50, true, B)],
      ['pure proc', ioProc(50), ioProc(50, B)],
    ];
    install(cases.map(([, unboosted]) => unboosted));
    useBuildStore.getState().maximizeEnhancementLevels({ boostLevel: B });
    slots().forEach((slot, i) => {
      const [label, , asPlaced] = cases[i];
      expect(slot?.boost, `${label}: bulk and placement disagree`).toBe(asPlaced.boost);
    });
  });
});
