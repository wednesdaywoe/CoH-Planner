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
 * object. The transforms that need build or UI state — the redirect / quick-snipe /
 * conditional merge that decides WHICH power this is, per-target scaling, and the pseudo-pet
 * merge — stay at the call sites.
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
  }

  return bag as PowerEffects;
}
