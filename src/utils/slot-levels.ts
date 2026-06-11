/**
 * Slot Level Computation
 *
 * Computes which character level each enhancement slot was "granted" at,
 * based on the game's slot grant schedule.
 *
 * Two modes:
 * - **Respec mode** (slotOrder empty): slots are assigned by power-pick order,
 *   redistributing optimally as if doing a respec.
 * - **Leveling mode** (slotOrder populated): slots are assigned in the
 *   chronological order they were added, preserving the user's leveling sequence.
 *
 * Slot 0 on every power is free (comes with the power pick at that level).
 * Additional slots (index 1+) consume from the SLOT_GRANTS pool.
 *
 * Keys: Uses powerKey("category:internalName") to avoid collisions when
 * multiple powers share the same internalName across categories.
 */

import type { Build, SelectedPower } from '@/types';
import { SLOT_GRANTS, getInherentAutoGrantedSlotLevels, getInherentAutoGrantedSlotCount } from '@/data';
import { powerKey, type PowerCategory } from '@/utils/power-key';

/**
 * Count enhancement slots that consume the level-up budget (the "/67" counter).
 *
 * Each power's base slot (index 0) is free. So are any auto-granted "freebie"
 * slots — Rebirth grants Health +2 and Stamina +2 outside the budget (71 total
 * slots, but only 67 allocatable during leveling). Those must NOT count, or the
 * counter goes red at 68–71. Slots placed BEYOND the freebies still count
 * (e.g. 6-slotting Health costs 3 budget slots: 6 − 1 base − 2 freebie). HC has
 * no auto-granted slots, so this reduces to "slots beyond the base".
 */
export function countPlacedBudgetSlots(
  build: Pick<Build, 'primary' | 'secondary' | 'pools' | 'epicPool' | 'inherents' | 'level'>,
): number {
  const extra = (powers: SelectedPower[]) =>
    powers.reduce((sum, p) => {
      const free = 1 + getInherentAutoGrantedSlotCount(p.internalName, build.level);
      return sum + Math.max(0, p.slots.length - free);
    }, 0);
  return (
    extra(build.primary.powers) +
    extra(build.secondary.powers) +
    build.pools.reduce((sum, pool) => sum + extra(pool.powers), 0) +
    (build.epicPool ? extra(build.epicPool.powers) : 0) +
    extra(build.inherents)
  );
}

/** Number of inherent (auto-granted) slots a power has, if any. */
function inherentCount(power: SelectedPower): number {
  return power.inherentSlotCount ?? 0;
}

/** Levels for a power's inherent slots, parallel to slots[1..inherentCount].
 *  Sourced from the active dataset's inherent-rules, so each server can plug
 *  in its own grant schedule (HC: none, Rebirth: Health [8,16] / Stamina
 *  [12,22], future servers TBD). */
function inherentLevels(power: SelectedPower): readonly number[] {
  const fixed = getInherentAutoGrantedSlotLevels(power.internalName);
  if (fixed.length === 0) return fixed;
  return fixed.slice(0, inherentCount(power));
}

interface CategorizedPower {
  power: SelectedPower;
  category: PowerCategory;
}

/** Build a flat, sorted array of slot grant levels up to maxLevel. */
function buildGrantPool(maxLevel: number): number[] {
  const pool: number[] = [];
  for (const [lvl, count] of Object.entries(SLOT_GRANTS)) {
    const level = parseInt(lvl);
    if (level > maxLevel) continue;
    for (let i = 0; i < count; i++) pool.push(level);
  }
  return pool.sort((a, b) => a - b);
}

/** Collect all powers in the build (excluding auto-granted sub-powers). */
function collectAllPowers(build: Build): CategorizedPower[] {
  const allPowers: CategorizedPower[] = [];
  const categoryOrder: PowerCategory[] = ['inherent', 'primary', 'secondary', 'pool', 'epic'];

  for (const p of build.inherents) {
    allPowers.push({ power: p, category: 'inherent' });
  }
  for (const p of build.primary.powers) {
    if (!p.isAutoGranted) allPowers.push({ power: p, category: 'primary' });
  }
  for (const p of build.secondary.powers) {
    if (!p.isAutoGranted) allPowers.push({ power: p, category: 'secondary' });
  }
  for (const pool of build.pools) {
    for (const p of pool.powers) {
      allPowers.push({ power: p, category: 'pool' });
    }
  }
  if (build.epicPool) {
    for (const p of build.epicPool.powers) {
      allPowers.push({ power: p, category: 'epic' });
    }
  }

  // Sort by effective pick level, then by category for ties.
  const effectiveLevel = (cp: CategorizedPower) =>
    cp.category === 'inherent' ? 1 : cp.power.level;

  allPowers.sort((a, b) => {
    const aLvl = effectiveLevel(a);
    const bLvl = effectiveLevel(b);
    if (aLvl !== bLvl) return aLvl - bLvl;
    return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
  });

  return allPowers;
}

/** Initialize result map with slot 0 = pick level for every power.
 *  For inherent powers with auto-granted inherent slots (Rebirth Health/Stamina),
 *  pre-fill those slot indices with their fixed grant levels so subsequent
 *  pool consumption skips them. */
function initSlotLevels(allPowers: CategorizedPower[]): Map<string, number[]> {
  const result = new Map<string, number[]>();
  for (const { power, category } of allPowers) {
    const pickLevel = category === 'inherent' ? 1 : power.level;
    const levels = new Array(power.slots.length).fill(pickLevel);
    if (category === 'inherent') {
      const fixed = inherentLevels(power);
      for (let i = 0; i < fixed.length && i + 1 < levels.length; i++) {
        levels[i + 1] = fixed[i];
      }
    }
    result.set(powerKey(category, power.internalName), levels);
  }
  return result;
}

/** Add auto-granted sub-powers (Kheldian forms, etc.) to the result. */
function addAutoGrantedPowers(build: Build, result: Map<string, number[]>) {
  const primaryCategory: PowerCategory = 'primary';
  const secondaryCategory: PowerCategory = 'secondary';
  for (const p of build.primary.powers) {
    const key = powerKey(primaryCategory, p.internalName);
    if (p.isAutoGranted && !result.has(key)) {
      result.set(key, p.slots.map(() => p.level));
    }
  }
  for (const p of build.secondary.powers) {
    const key = powerKey(secondaryCategory, p.internalName);
    if (p.isAutoGranted && !result.has(key)) {
      result.set(key, p.slots.map(() => p.level));
    }
  }
}

/**
 * Resolve which category a slotOrder entry belongs to.
 * New entries have an explicit `category` field.
 * Legacy entries (no category) fall back to searching the build.
 */
function resolveSlotCategory(
  build: Build,
  powerName: string,
  category?: string
): PowerCategory | null {
  if (category && ['primary', 'secondary', 'pool', 'epic', 'inherent'].includes(category)) {
    return category as PowerCategory;
  }
  // Legacy fallback: search categories in standard order
  if (build.primary.powers.some((p) => p.internalName === powerName)) return 'primary';
  if (build.secondary.powers.some((p) => p.internalName === powerName)) return 'secondary';
  for (const pool of build.pools) {
    if (pool.powers.some((p) => p.internalName === powerName)) return 'pool';
  }
  if (build.epicPool?.powers.some((p) => p.internalName === powerName)) return 'epic';
  if (build.inherents.some((p) => p.internalName === powerName)) return 'inherent';
  return null;
}

/**
 * Respec mode: assign slot levels by power-pick order.
 * Each power consumes grants sequentially from the pool.
 */
function computeSlotLevelsRespec(build: Build): Map<string, number[]> {
  const allPowers = collectAllPowers(build);
  const result = initSlotLevels(allPowers);
  const grantPool = buildGrantPool(build.level);

  let grantIndex = 0;

  for (const { power, category } of allPowers) {
    const pickLevel = category === 'inherent' ? 1 : power.level;
    const key = powerKey(category, power.internalName);
    const levels = result.get(key)!;
    // Auto-granted inherent slots (Rebirth Health/Stamina) sit at fixed levels
    // and don't consume from the user grant pool — skip them.
    const skipUntil = category === 'inherent' ? 1 + inherentCount(power) : 1;

    for (let s = skipUntil; s < power.slots.length; s++) {
      while (grantIndex < grantPool.length && grantPool[grantIndex] < pickLevel) {
        grantIndex++;
      }
      levels[s] = grantPool[grantIndex] ?? pickLevel;
      grantIndex++;
    }
  }

  addAutoGrantedPowers(build, result);
  return result;
}

/**
 * Leveling mode: assign slot levels honoring each entry's stored `level`
 * when valid. Entries without a stored level (legacy / first-time placements)
 * fall back to greedy assignment in chronological order.
 *
 * Storing the assigned level per entry is what makes removing a slot behave
 * like Mids: peers keep the level they were placed at instead of cascading
 * down to fill the gap. The freed grant is naturally available for the next
 * slot placement.
 */
function computeSlotLevelsLeveling(build: Build): Map<string, number[]> {
  const allPowers = collectAllPowers(build);
  const result = initSlotLevels(allPowers);
  const grantPool = buildGrantPool(build.level);

  // Build a lookup for power pick levels (keyed by powerKey)
  const pickLevelMap = new Map<string, number>();
  for (const { power, category } of allPowers) {
    pickLevelMap.set(
      powerKey(category, power.internalName),
      category === 'inherent' ? 1 : power.level
    );
  }

  // Track which grants have been consumed (by index)
  const usedGrants = new Set<number>();

  // Track inherent-slot indices to skip when iterating slotOrder
  const inherentSkipIndex = new Map<string, number>(); // key → first user-placeable index
  for (const { power, category } of allPowers) {
    if (category !== 'inherent') continue;
    const skipUntil = 1 + inherentCount(power);
    if (skipUntil > 1) {
      inherentSkipIndex.set(powerKey(category, power.internalName), skipUntil);
    }
  }

  interface PendingEntry {
    entry: Build['slotOrder'][number];
    key: string;
    pickLevel: number;
    levels: number[];
  }

  // Pass 1: honor entries with a valid stored grant level.
  // A stored level is valid when it's >= the power's pick level and an
  // unused grant at that exact level still exists in the pool. (Pool only
  // contains levels <= build.level, so out-of-range levels naturally fail.)
  const needsAssign: PendingEntry[] = [];
  for (const entry of build.slotOrder) {
    const cat = resolveSlotCategory(build, entry.powerName, entry.category);
    if (!cat) continue;

    const key = powerKey(cat, entry.powerName);
    const levels = result.get(key);
    const pickLevel = pickLevelMap.get(key);
    if (!levels || pickLevel === undefined || entry.slotIndex >= levels.length) continue;
    const skipUntil = inherentSkipIndex.get(key) ?? 1;
    if (entry.slotIndex < skipUntil) continue;

    const stored = entry.level;
    if (stored !== undefined && stored >= pickLevel) {
      const gi = findUnusedGrantAtLevel(grantPool, stored, usedGrants);
      if (gi !== -1) {
        levels[entry.slotIndex] = stored;
        usedGrants.add(gi);
        continue;
      }
    }
    needsAssign.push({ entry, key, pickLevel, levels });
  }

  // Pass 2: greedy assignment for entries without a usable stored level
  // (legacy entries, or stored levels invalidated by a level/pick-level change).
  for (const { entry, pickLevel, levels } of needsAssign) {
    let assigned = false;
    for (let gi = 0; gi < grantPool.length; gi++) {
      if (usedGrants.has(gi)) continue;
      if (grantPool[gi] < pickLevel) continue;
      levels[entry.slotIndex] = grantPool[gi];
      usedGrants.add(gi);
      assigned = true;
      break;
    }
    if (!assigned) {
      // No grants left — use pick level as fallback
      levels[entry.slotIndex] = pickLevel;
    }
  }

  addAutoGrantedPowers(build, result);
  return result;
}

/** Find the index of an unused grant whose level exactly matches `target`. */
function findUnusedGrantAtLevel(
  grantPool: number[],
  target: number,
  used: Set<number>
): number {
  for (let gi = 0; gi < grantPool.length; gi++) {
    if (grantPool[gi] !== target) continue;
    if (used.has(gi)) continue;
    return gi;
  }
  return -1;
}

/**
 * Find the next available grant level for a new slot placement on a power
 * with `pickLevel`. Honors stored levels on existing slotOrder entries so
 * removed slots' levels return to the pool first (Mids-style behavior).
 *
 * Returns null when no grant >= pickLevel is free at the current build level.
 */
export function findNextAvailableGrantLevel(
  build: Build,
  pickLevel: number
): number | null {
  const grantPool = buildGrantPool(build.level);
  const usedGrants = new Set<number>();

  // Replay existing slotOrder, honoring stored levels first, greedy fallback after.
  const pendingPickLevels: number[] = [];
  for (const entry of build.slotOrder) {
    const cat = resolveSlotCategory(build, entry.powerName, entry.category);
    if (!cat) continue;
    const entryPickLevel = cat === 'inherent' ? 1 : pickLevelForEntry(build, cat, entry.powerName);
    if (entryPickLevel === null) continue;

    const stored = entry.level;
    if (stored !== undefined && stored >= entryPickLevel) {
      const gi = findUnusedGrantAtLevel(grantPool, stored, usedGrants);
      if (gi !== -1) {
        usedGrants.add(gi);
        continue;
      }
    }
    pendingPickLevels.push(entryPickLevel);
  }
  for (const pl of pendingPickLevels) {
    for (let gi = 0; gi < grantPool.length; gi++) {
      if (usedGrants.has(gi)) continue;
      if (grantPool[gi] < pl) continue;
      usedGrants.add(gi);
      break;
    }
  }

  for (let gi = 0; gi < grantPool.length; gi++) {
    if (usedGrants.has(gi)) continue;
    if (grantPool[gi] < pickLevel) continue;
    return grantPool[gi];
  }
  return null;
}

function pickLevelForEntry(
  build: Build,
  category: PowerCategory,
  powerName: string
): number | null {
  const findIn = (powers: readonly SelectedPower[]) =>
    powers.find((p) => p.internalName === powerName);
  let p: SelectedPower | undefined;
  switch (category) {
    case 'primary': p = findIn(build.primary.powers); break;
    case 'secondary': p = findIn(build.secondary.powers); break;
    case 'pool':
      for (const pool of build.pools) {
        p = findIn(pool.powers);
        if (p) break;
      }
      break;
    case 'epic': p = build.epicPool ? findIn(build.epicPool.powers) : undefined; break;
    case 'inherent': return 1;
  }
  return p ? p.level : null;
}

/**
 * Compute slot level assignments for every power in the build.
 *
 * Returns a Map keyed by powerKey ("category:internalName"), where each value
 * is a number[] parallel to the power's slots array. Index 0 = power pick level
 * (free slot), index 1+ = the grant pool level consumed for that slot.
 *
 * Automatically selects leveling mode if slotOrder has entries,
 * otherwise uses respec mode.
 */
export function computeAllSlotLevels(build: Build): Map<string, number[]> {
  // Defensive: `slotOrder` is normally initialized by every load path
  // (importBuild / hydrateBuild / rehydrate migration), but a build whose
  // rehydrate migration aborted partway can reach here with it undefined.
  // This is the single chokepoint for slot-level computation, so guarding
  // here keeps every consumer (useSlotLevels, freeze/move helpers, exports)
  // from crashing on a half-migrated build.
  if (!build.slotOrder || build.slotOrder.length === 0) {
    return computeSlotLevelsRespec(build);
  }
  return computeSlotLevelsLeveling(build);
}

/**
 * Ensure every non-base, non-inherent-auto slot on every power has a
 * matching `slotOrder` entry with a stored `level`. Mutates the build in
 * place. Safe to run repeatedly.
 *
 * Why this exists: builds imported from Mids (and some legacy paths) leave
 * `slotOrder` empty even though the powers carry many extra slots. That's
 * fine for *initial* display — `computeAllSlotLevels` falls into respec
 * mode and assigns levels from the grant pool by pick order. But as soon
 * as the user adds OR removes a single slot, `slotOrder` becomes
 * non-empty, which flips computation into leveling mode. Leveling mode
 * only sets levels for slots with a matching `slotOrder` entry; every
 * other slot collapses to its power's pick level. The visual symptom is
 * "all my slot levels suddenly mirror their power's pick level".
 *
 * Running this once on import / rehydration captures the respec-mode
 * levels and locks them in as stored levels, so subsequent
 * add/remove interactions preserve every other slot's position.
 */
export function ensureSlotOrderPopulated(build: Build): boolean {
  const allPowers = collectAllPowers(build);

  // Build a set of (category, powerName, slotIndex) keys for existing entries
  const existing = new Set<string>();
  for (const e of build.slotOrder) {
    const cat = resolveSlotCategory(build, e.powerName, e.category);
    if (!cat) continue;
    existing.add(`${cat}|${e.powerName}|${e.slotIndex}`);
  }

  const computed = computeAllSlotLevels(build);
  const newEntries: Build['slotOrder'][number][] = [];

  for (const { power, category } of allPowers) {
    const key = powerKey(category, power.internalName);
    const levels = computed.get(key);
    if (!levels) continue;
    // Skip slot 0 (free with the power) and any auto-granted inherent slots
    // (those sit at fixed levels and aren't user-allocated).
    const skipUntil = category === 'inherent' ? 1 + inherentCount(power) : 1;
    for (let s = skipUntil; s < power.slots.length; s++) {
      if (existing.has(`${category}|${power.internalName}|${s}`)) continue;
      newEntries.push({
        powerName: power.internalName,
        slotIndex: s,
        category,
        level: levels[s],
      });
    }
  }

  if (newEntries.length === 0) return false;
  build.slotOrder = [...build.slotOrder, ...newEntries];
  return true;
}

/**
 * Back-fill `level` on slotOrder entries that don't have one yet. Mutates
 * the build in place. Safe to run repeatedly. Used as a migration when
 * loading legacy builds so the Mids-style remove/replace behavior kicks in
 * immediately without waiting for the user to re-place every slot.
 */
export function backfillSlotOrderLevels(build: Build): boolean {
  if (build.slotOrder.length === 0) return false;
  const needsBackfill = build.slotOrder.some((e) => e.level === undefined);
  if (!needsBackfill) return false;

  const levels = computeSlotLevelsLeveling(build);
  let changed = false;
  for (const entry of build.slotOrder) {
    if (entry.level !== undefined) continue;
    const cat = resolveSlotCategory(build, entry.powerName, entry.category);
    if (!cat) continue;
    const key = powerKey(cat, entry.powerName);
    const powerLevels = levels.get(key);
    if (!powerLevels || entry.slotIndex >= powerLevels.length) continue;
    entry.level = powerLevels[entry.slotIndex];
    changed = true;
  }
  return changed;
}

// ============================================================
// SLOT-LEVEL MOVE / SWAP
// ============================================================

/**
 * Identifies one allocated slot on one power. `category` is optional — when
 * omitted it is resolved from the build (matching `removeSlot`'s by-name
 * behavior), so callers that only have a power's internal name can still
 * address its slots.
 */
export interface SlotLevelRef {
  powerName: string;
  slotIndex: number;
  category?: PowerCategory;
}

/** A power resolved to a concrete category, as `collectAllPowers` sees it. */
interface ResolvedRef {
  power: SelectedPower;
  category: PowerCategory;
}

/** Resolve a SlotLevelRef to its power + concrete category, or null. */
function resolveRef(build: Build, ref: SlotLevelRef): ResolvedRef | null {
  const category = resolveSlotCategory(build, ref.powerName, ref.category);
  if (!category) return null;
  const cp = collectAllPowers(build).find(
    (c) => c.category === category && c.power.internalName === ref.powerName
  );
  return cp ? { power: cp.power, category } : null;
}

/**
 * First user-allocatable slot index on a power: index 0 is the free base
 * slot, and inherents may carry auto-granted (fixed-level) slots after it.
 * Neither can have its level moved.
 */
function userSlotFloor(power: SelectedPower, category: PowerCategory): number {
  return category === 'inherent' ? 1 + inherentCount(power) : 1;
}

/** A power's pick level — the earliest a slot on it may be placed. */
function powerPickLevel(power: SelectedPower, category: PowerCategory): number {
  return category === 'inherent' ? 1 : power.level;
}

/**
 * Whether a single slot is a user-allocated slot whose level can be moved
 * (i.e. not the free base slot and not an auto-granted inherent slot, and it
 * actually exists on the power). Used to gate the "Move slot level…" menu item.
 */
export function isMovableSlot(build: Build, ref: SlotLevelRef): boolean {
  const r = resolveRef(build, ref);
  if (!r) return false;
  return (
    ref.slotIndex >= userSlotFloor(r.power, r.category) &&
    ref.slotIndex < r.power.slots.length
  );
}

/**
 * Whether the grant levels of two slots can be swapped. Both must be
 * user-allocated slots (see `isMovableSlot`), and after the swap each slot's
 * level must still be >= its power's pick level (a slot can't sit at a level
 * earlier than its power was taken).
 */
export function canMoveSlotLevel(
  build: Build,
  source: SlotLevelRef,
  target: SlotLevelRef
): boolean {
  const s = resolveRef(build, source);
  const t = resolveRef(build, target);
  if (!s || !t) return false;

  // Same slot → nothing to swap.
  if (s.category === t.category && source.powerName === target.powerName && source.slotIndex === target.slotIndex) {
    return false;
  }

  if (!isMovableSlot(build, source) || !isMovableSlot(build, target)) return false;

  const levels = computeAllSlotLevels(build);
  const sLevel = levels.get(powerKey(s.category, source.powerName))?.[source.slotIndex];
  const tLevel = levels.get(powerKey(t.category, target.powerName))?.[target.slotIndex];
  if (sLevel === undefined || tLevel === undefined) return false;

  // After the swap, source holds tLevel and target holds sLevel.
  return tLevel >= powerPickLevel(s.power, s.category) &&
    sLevel >= powerPickLevel(t.power, t.category);
}

/**
 * Return a NEW build with the grant levels of two slots swapped. Enhancers are
 * untouched — they live in `power.slots`, not `slotOrder`, so swapping levels
 * is purely a slotOrder operation. Returns null if the swap is invalid.
 *
 * Freezes current computed levels into `slotOrder` first (via
 * `ensureSlotOrderPopulated`) so the swap is well-defined even from respec
 * mode or a partially-populated slotOrder.
 */
export function applySlotLevelMove(
  build: Build,
  source: SlotLevelRef,
  target: SlotLevelRef
): Build | null {
  if (!canMoveSlotLevel(build, source, target)) return null;

  const s = resolveRef(build, source)!;
  const t = resolveRef(build, target)!;

  const next: Build = { ...build, slotOrder: [...build.slotOrder] };
  ensureSlotOrderPopulated(next);
  backfillSlotOrderLevels(next);

  const levels = computeAllSlotLevels(next);
  const sLevel = levels.get(powerKey(s.category, source.powerName))![source.slotIndex];
  const tLevel = levels.get(powerKey(t.category, target.powerName))![target.slotIndex];

  const matches = (
    entry: Build['slotOrder'][number],
    powerName: string,
    slotIndex: number,
    category: PowerCategory
  ): boolean =>
    entry.powerName === powerName &&
    entry.slotIndex === slotIndex &&
    resolveSlotCategory(next, entry.powerName, entry.category) === category;

  next.slotOrder = next.slotOrder.map((entry) =>
    matches(entry, source.powerName, source.slotIndex, s.category)
      ? { ...entry, level: tLevel }
      : matches(entry, target.powerName, target.slotIndex, t.category)
        ? { ...entry, level: sLevel }
        : entry
  );

  return next;
}
