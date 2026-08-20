/**
 * Test fixtures that produce the shapes the BUILD STORE produces.
 *
 * Calc tests used to hand-roll partial objects — a power without `powerSet`/`level`, an
 * enhancement without `id`/`aspects` — and cast them through `any`. The old TS calc tolerated
 * that; the engine's `CharacterState` does not (serde rejects the missing field, the adapter
 * throws, and the totals come back all-zero), so those fixtures were quietly grading nothing.
 *
 * These helpers go through the same factories the store uses, so a fixture is a build the app
 * could actually hold. `SelectedPower.powerSet` and `.level` are REQUIRED by the type — the
 * `any` casts are what let them go missing.
 */

import { getIOSet } from '@/data';
import { createIOSetEnhancement } from '@/data/enhancement-registry';
import type { Enhancement } from '@/types/enhancement';
import type { Power, SelectedPower } from '@/types/power';

/**
 * One slotted set piece, built by the same factory the enhancement picker calls.
 * `pieceName` is the piece's real label in the set data (e.g. `'Stealth'`), which is also the
 * key `findProcData` resolves procs by — a made-up name resolves to no proc at all.
 */
export function ioSetSlot(setId: string, pieceName: string, level = 50): Enhancement {
  const set = getIOSet(setId);
  if (!set) throw new Error(`fixture: no IO set '${setId}'`);
  const index = set.pieces.findIndex((p) => p.name === pieceName);
  if (index < 0) {
    throw new Error(`fixture: set '${setId}' has no piece '${pieceName}' (has: ${set.pieces.map((p) => p.name).join(', ')})`);
  }
  return createIOSetEnhancement(set, set.pieces[index], index, { attuned: false, level });
}

/** A picked power: the def plus the fields the store stamps on every selection. */
export function pick(
  def: Power,
  powerSet: string,
  opts: { isActive?: boolean; level?: number; slots?: (Enhancement | null)[] } = {},
): SelectedPower {
  return {
    ...def,
    powerSet,
    level: opts.level ?? 1,
    slots: opts.slots ?? [],
    ...(opts.isActive === undefined ? {} : { isActive: opts.isActive }),
  };
}
