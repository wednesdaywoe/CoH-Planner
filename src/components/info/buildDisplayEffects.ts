/**
 * The display effects bag (PROD6C-3a).
 *
 * `RegistryEffectsDisplay` does not render a power's authored `effects` — it renders a bag
 * the surfaces BUILD at the render edge, and InfoPanel, PowerInfoTooltip and
 * CompareSlottingModal each built their own. This is that build, extracted once so there is a
 * single bag, and so the engine's `granted.rs` has one shape to mirror instead of three that
 * disagreed with each other.
 *
 * Everything here is a pure function of the power object — the four transforms PROD6C-3
 * enumerates as (2) the merged `stats`, (3) healing extracted from the damage array,
 * (4) `buffDuration` backfilled from a summon's duration, and (5) the flattened `movement`
 * object. Two further transforms live below it rather than inside it, because each runs on
 * the built bag: (6) per-target scaling, which reads UI state, and (7) the pseudo-pet merge.
 * The one transform that stays at the call sites is the redirect / quick-snipe / conditional
 * merge that decides WHICH power this is.
 *
 * Two divergences between the surfaces are settled here rather than preserved (counts are
 * powers per fork over the deduped runtime corpus, homecoming / rebirth / thunderspy):
 *
 * * `arc` is converted to degrees from whichever partition carries it. Primary/secondary
 *   powers store the raw binary radians on `stats.arc` and pool/epic powers on
 *   `effects.arc` (`transformPoolPower` builds no `stats`), and the registry row is a
 *   `degrees` one — the tooltip read only `stats.arc` and so rendered a pool power's radian
 *   value into a degrees row (48 / 42 / 46 powers).
 * * `buffDuration` from a summon's duration was InfoPanel-only (297 / 273 / 280 powers).
 *
 * The tooltip's six `flySpeed` / `runSpeed` / `jumpSpeed` / `jumpHeight` / `regeneration` /
 * `recovery` top-level mappings and its `effects.endurance` fallback are NOT carried over:
 * measured across all three forks, no power carries any of those keys at the top level of a
 * runtime bag (`transformPoolPower` destructures `endurance` away into the renamed
 * `enduranceCost`), so they are dead rather than divergent.
 */
import type { Power, PowerEffects } from '@/types';
import { arcToDegrees } from '@/data/proc-data';
import { extractHealingFromDamage } from '@/utils/calculations/healing';
import { synthesizePseudoPetEffects } from '@/utils/calculations/pet-damage';

/** Toggle tick interval when the data omits one — end/s = endurance / activatePeriod. */
const DEFAULT_ACTIVATE_PERIOD = 0.5;

/**
 * Build the bag `RegistryEffectsDisplay` resolves for one power.
 *
 * `damage` defaults to the power's own, and is a parameter because each surface reaches its
 * effective damage array differently (InfoPanel merges conditionals onto the power itself;
 * the tooltip merges the stance-gated entries into the array) — the heal extraction must
 * see the merged array either way.
 */
export function buildDisplayEffects(
  power: Power,
  damage: unknown = power.damage ?? power.effects?.damage,
): PowerEffects {
  const effects = power.effects ?? ({} as PowerEffects);
  const stats = power.stats;
  const bag: Record<string, unknown> = { ...effects };

  // Execution stats live on `stats` for primary/secondary powers and in the bag itself for
  // pool/epic ones. A zero is no stat (the surfaces' own `&&` truthiness), so it leaves any
  // authored bag value standing.
  if (stats?.endurance) {
    bag.enduranceCost = power.powerType === 'Toggle'
      ? stats.endurance / (stats.activatePeriod ?? DEFAULT_ACTIVATE_PERIOD)
      : stats.endurance;
  }
  if (stats?.recharge) bag.recharge = stats.recharge;
  if (stats?.accuracy) bag.accuracy = stats.accuracy;
  if (stats?.range) bag.range = stats.range;
  if (stats?.castTime) bag.castTime = stats.castTime;
  if (stats?.radius) bag.radius = stats.radius;
  if (stats?.maxTargets) bag.maxTargets = stats.maxTargets;

  const rawArc = stats?.arc ?? effects.arc;
  if (rawArc != null) bag.arc = arcToDegrees(rawArc);

  // A heal authored inside the damage array (Life Drain, Reconstruction) rather than as an
  // effect. An authored `healing` wins.
  if (!effects.healing) {
    const healing = extractHealingFromDamage(damage);
    if (healing) bag.healing = healing;
  }

  // A summon with no duration effect of its own displays the pet's lifespan.
  if (!effects.buffDuration && !effects.effectDuration && effects.summon?.duration) {
    bag.buffDuration = effects.summon.duration;
  }

  // The nested movement object (Super Jump, Fly, Sprint) carries the registry's per-axis
  // keys one level down.
  const movement = effects.movement as Record<string, unknown> | undefined;
  if (movement && typeof movement === 'object') {
    if (movement.flySpeed) bag.fly = movement.flySpeed;
    if (movement.runSpeed) bag.runSpeed = movement.runSpeed;
    if (movement.jumpSpeed) bag.jumpSpeed = movement.jumpSpeed;
    if (movement.jumpHeight) bag.jumpHeight = movement.jumpHeight;
    // The converter's `<axis>Unenhanced` split slots (FLYPOOL-1): a paired
    // IgnoreStrength half beside the enhanceable one, flattened to the flat
    // spellings the registry resolves through the base key (ENT-6) and the
    // engine's granted.rs emits from the atoms. Pool Fly carries both halves.
    if (movement.flySpeedUnenhanced) bag.flyUnenhanced = movement.flySpeedUnenhanced;
    if (movement.runSpeedUnenhanced) bag.runSpeedUnenhanced = movement.runSpeedUnenhanced;
    if (movement.jumpSpeedUnenhanced) bag.jumpSpeedUnenhanced = movement.jumpSpeedUnenhanced;
    if (movement.jumpHeightUnenhanced) bag.jumpHeightUnenhanced = movement.jumpHeightUnenhanced;
  }

  return bag as PowerEffects;
}

// ---------------------------------------------------------------------------
// the per-target transform (PROD6C-3b)
// ---------------------------------------------------------------------------
//
// Unlike everything above this is NOT a pure function of the power: it reads the power's own
// stacking-slider value out of the UI store. It lives here anyway because it transforms the
// same bag, immediately after it is built, and because the engine's `stacking.rs` mirrors the
// pair — the slider gate and the adjustment — as one step of `display_effects`.


/**
 * Check if a value (or by-type sub-values) has a perTarget field.
 */
export function hasPerTargetField(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  // `maxHPFractionPerTarget` is the same field for an absorb whose magnitude is an
  // Expression rather than a scale — it grows the row the same way.
  if ('perTarget' in value || 'maxHPFractionPerTarget' in value) return true;
  // Check by-type sub-objects (defenseBuff, resistance, etc.)
  for (const subVal of Object.values(value as Record<string, unknown>)) {
    if (typeof subVal === 'object' && subVal !== null
      && ('perTarget' in subVal || 'maxHPFractionPerTarget' in subVal)) return true;
  }
  return false;
}

/**
 * Data-driven detection: show stacking slider for either per-target AoE
 * scaling (perTarget metadata + maxTargets) or linear self-stacking
 * (`effects.maxStacks` set explicitly, e.g. Psychokinetic Barrier).
 */
export function getStackingInfo(power: Power): { maxStacks: number; label: string } | null {
  if (!power.effects) return null;

  // AoE per-target powers (Soul Drain, Eclipse, Power Sink, etc.) — when
  // any effect carries a `perTarget` field, the slider's natural axis is
  // "targets hit" with max from stats.maxTargets. Soul Drain in particular
  // also has effects.maxStacks (self-stack on double-cast), but the
  // per-target story is the dominant one for tooltip math, so check it
  // first to prevent the smaller stack-2 cap from winning.
  const hasPerTarget = Object.values(power.effects).some(v => hasPerTargetField(v));
  if (hasPerTarget) {
    const maxTargets = power.stats?.maxTargets;
    if (maxTargets && maxTargets > 1 && maxTargets !== 255) {
      return { maxStacks: maxTargets, label: 'Targets Hit' };
    }
  }

  // Linear self-stacking — power declares maxStacks directly. Doesn't
  // require perTarget metadata; the slider just multiplies scale of any
  // effect listed in `effects.stacksLinear`. Falls through here when there
  // is no per-target scaling (e.g. Siphon Speed's caster recharge buff).
  if (power.effects.maxStacks) {
    // Ramp-stacking powers (Spirit Ward → 1 stack per 3s within one cast)
    // carry `stackInterval`; recast-stacking powers (Crab Spider Serum,
    // Build Up, etc.) don't. Surface the cadence on the slider label only
    // for the ramp case so we don't mislabel recast stacking as "every Xs".
    const label = power.effects.stackInterval && power.effects.stackInterval > 0
      ? `Stacks (every ${power.effects.stackInterval}s)`
      : 'Stacks';
    return { maxStacks: power.effects.maxStacks, label };
  }

  return null;
}

/**
 * Adjust ScaledEffect scale values for per-target stacking.
 * At N targets: effective_scale = scale + perTarget × (N - 1)
 * Recursively handles by-type objects (defenseBuff, resistance).
 */
function adjustScaledValue(value: unknown, targetsHit: number): unknown {
  if (typeof value !== 'object' || value === null) return value;
  if ('scale' in value && 'perTarget' in value) {
    const se = value as { scale: number; table: string; perTarget?: number };
    if (se.perTarget && targetsHit > 1) {
      return { ...se, scale: se.scale + se.perTarget * (targetsHit - 1) };
    }
    return value;
  }
  // A MaxHP-fraction absorb has no `scale` for the increment to grow — its magnitude
  // rides an Expression, so the per-foe step arrives as `maxHPFractionPerTarget`.
  if ('maxHPFraction' in value && 'maxHPFractionPerTarget' in value) {
    const fr = value as { maxHPFraction: number; maxHPFractionPerTarget?: number };
    if (fr.maxHPFractionPerTarget && targetsHit > 1) {
      return { ...fr, maxHPFraction: fr.maxHPFraction + fr.maxHPFractionPerTarget * (targetsHit - 1) };
    }
    return value;
  }
  // By-type object — recurse into sub-entries
  const result: Record<string, unknown> = {};
  let changed = false;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const adjusted = adjustScaledValue(v, targetsHit);
    result[k] = adjusted;
    if (adjusted !== v) changed = true;
  }
  return changed ? result : value;
}

/**
 * Multiply the `scale` field of a ScaledEffect (or every leaf of a by-type
 * object) by `multiplier`. Used for linear self-stacking — every additional
 * stack just adds another instance of the base magnitude.
 */
function multiplyScale(value: unknown, multiplier: number): unknown {
  if (multiplier === 1) return value;
  if (typeof value !== 'object' || value === null) return value;
  if ('scale' in value && typeof (value as { scale: unknown }).scale === 'number') {
    const se = value as { scale: number; [k: string]: unknown };
    return { ...se, scale: se.scale * multiplier };
  }
  // By-type object — recurse
  const result: Record<string, unknown> = {};
  let changed = false;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const adj = multiplyScale(v, multiplier);
    result[k] = adj;
    if (adj !== v) changed = true;
  }
  return changed ? result : value;
}

/**
 * Create an adjusted copy of effects with per-target scale values multiplied
 * (perTarget AoE math) and/or stacks-linear effects multiplied by stack count.
 */
function adjustEffectsForTargets(
  effects: PowerEffects,
  targetsHit: number
): PowerEffects {
  if (targetsHit <= 1) return effects;
  const stacksLinear = new Set(effects.stacksLinear || []);
  const adjusted: Record<string, unknown> = {};
  let changed = false;
  for (const [key, value] of Object.entries(effects)) {
    let adj = adjustScaledValue(value, targetsHit);
    // Linear self-stack multiply — but only for keys NOT already driven by
    // perTarget (adjustScaledValue above handles those); applying both would
    // double-scale. Honor a per-effect cap so a lower-cap key (Psychokinetic
    // Barrier's absorb, cap 2) doesn't over-multiply when the slider (maxStacks
    // 3) is dragged past its own limit.
    if (stacksLinear.has(key) && !hasPerTargetField(value)) {
      const cap = effects.stackCaps?.[key] ?? effects.maxStacks;
      const n = cap ? Math.min(targetsHit, cap) : targetsHit;
      adj = multiplyScale(adj, n);
    }
    adjusted[key] = adj;
    if (adj !== value) changed = true;
  }
  return (changed ? adjusted : effects) as PowerEffects;
}

/**
 * The display bag a surface renders for one power at its current slider setting: the built bag
 * when the power shows no stacking slider or the slider is at 0/1, else the adjusted copy.
 *
 * The `targetsHit > 1` identity is the DISPLAY rule, and deliberately not the totals one — the
 * accumulator reads an absent count as zero foes and zeroes a `perTarget` buff (PROD6B-2d).
 * A display row is only ever grown here, never zeroed.
 */
export function withTargetsHit(power: Power, effects: PowerEffects, targetsHit: number): PowerEffects {
  if (!getStackingInfo(power) || targetsHit <= 1) return effects;
  return adjustEffectsForTargets(effects, targetsHit);
}

// ---------------------------------------------------------------------------
// the pseudo-pet merge (PROD6C-3c)
// ---------------------------------------------------------------------------

/**
 * Merge a summon power's pseudo-pet debuffs UNDER its own bag — the parent's keys win, the
 * pet fills in keys the parent doesn't carry. Powers like Glue Arrow deliver their
 * enhanceable debuffs entirely through a non-commandable pseudo-pet, so without this the
 * player's enhancements never reach the rows they scale.
 *
 * Applied AFTER `withTargetsHit`, as both surfaces do: the synthesized fragment carries no
 * `perTarget` metadata for the slider to grow.
 */
export function withPseudoPetEffects(power: Power, effects: PowerEffects): PowerEffects {
  const pseudo = synthesizePseudoPetEffects(power.effects?.summon);
  return pseudo ? { ...pseudo, ...effects } : effects;
}
