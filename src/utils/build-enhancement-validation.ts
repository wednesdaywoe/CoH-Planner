/**
 * Build-level enhancement legality.
 *
 * A slotted enhancement is only "real" if the game would let it live in its
 * host power — the same allow-list the Enhancement Picker enforces
 * (`enhancementAllowedInPower`). Builds can still ARRIVE with illegal slots:
 * imports (Mids/MXD/game/external) and share-links hydrate slots without
 * re-validation, and the internal names of a few powersets are permuted vs
 * their display names (HC Shield Defense: internal `Battle_Agility` is the mez
 * "Active Defense"), so an internalName-keyed import can route defense sets into
 * a mez power that can't hold them.
 *
 * These helpers are the single source of truth for "which slots are illegal",
 * consumed non-destructively by:
 *   - the calc (`withoutIllegalSlots`) — illegal slots are excluded from stats
 *     and set-bonus tallies so totals match in-game;
 *   - the UI — flag the offending slots;
 *   - the import read-out — explain what was dropped and why.
 *
 * Nothing here mutates the build: the calc consumes a shallow copy with the
 * illegal slots nulled (array length preserved, so slot indices — and anything
 * keyed on them, like proc overrides — stay stable).
 */
import type { Build, SelectedPower } from '@/types';
import type { Enhancement } from '@/types/enhancement';
import { enhancementAllowedInPower } from './enhancement-eligibility';

export type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic' | 'inherent';

export interface IllegalSlot {
  category: PowerCategory;
  powerName: string;
  internalName?: string;
  slotIndex: number;
  enhancement: Enhancement;
}

/** Indices of the slots in one power that hold an enhancement the game forbids. */
export function powerIllegalSlotIndices(power: SelectedPower): number[] {
  // Only judge powers that carry their allow-list — a resolved power def always
  // has `allowedEnhancements` (a required Power field), even mez-only powers
  // (["EnduranceReduction","Recharge"]). A slim/partial power without it gives
  // us nothing to judge against, so we must NOT flag its slots (that would strip
  // legitimate enhancements on any data gap — false positives over false negs).
  if (!Array.isArray(power.allowedEnhancements)) return [];
  const out: number[] = [];
  (power.slots ?? []).forEach((slot, i) => {
    if (slot && !enhancementAllowedInPower(slot, power)) out.push(i);
  });
  return out;
}

/** Walk every selected power with its category label. */
function forEachPower(
  build: Build,
  fn: (power: SelectedPower, category: PowerCategory) => void,
): void {
  build.primary?.powers?.forEach((p) => fn(p, 'primary'));
  build.secondary?.powers?.forEach((p) => fn(p, 'secondary'));
  build.pools?.forEach((pool) => pool.powers?.forEach((p) => fn(p, 'pool')));
  build.epicPool?.powers?.forEach((p) => fn(p, 'epic'));
  build.inherents?.forEach((p) => fn(p, 'inherent'));
}

/** Every illegal slot across the whole build, in walk order. */
export function findIllegalSlots(build: Build): IllegalSlot[] {
  const illegal: IllegalSlot[] = [];
  forEachPower(build, (power, category) => {
    for (const slotIndex of powerIllegalSlotIndices(power)) {
      illegal.push({
        category,
        powerName: power.name,
        internalName: power.internalName,
        slotIndex,
        enhancement: power.slots[slotIndex] as Enhancement,
      });
    }
  });
  return illegal;
}

/**
 * A shallow copy of the build with every illegal slot nulled — the view the
 * calc should compute against so illegal enhancements contribute neither
 * enhancement values nor set bonuses. Only powers that actually have an illegal
 * slot are copied; everything else is shared by reference. Returns the original
 * build unchanged when there is nothing illegal (the common case).
 */
export function withoutIllegalSlots(build: Build): Build {
  let anyIllegal = false;

  const sanitizePower = (power: SelectedPower): SelectedPower => {
    const bad = powerIllegalSlotIndices(power);
    if (bad.length === 0) return power;
    anyIllegal = true;
    const badSet = new Set(bad);
    return {
      ...power,
      slots: power.slots.map((slot, i) => (badSet.has(i) ? null : slot)),
    };
  };

  const primary = { ...build.primary, powers: build.primary.powers.map(sanitizePower) };
  const secondary = { ...build.secondary, powers: build.secondary.powers.map(sanitizePower) };
  const pools = build.pools.map((pool) => ({ ...pool, powers: pool.powers.map(sanitizePower) }));
  const epicPool = build.epicPool
    ? { ...build.epicPool, powers: build.epicPool.powers.map(sanitizePower) }
    : build.epicPool;
  const inherents = build.inherents.map(sanitizePower);

  if (!anyIllegal) return build;
  return { ...build, primary, secondary, pools, epicPool, inherents };
}
