/**
 * Shared utilities for power row rendering
 * Consolidates shouldShowToggle and hasHealingDamage
 * that were previously duplicated across multiple components.
 */

import { hasSelfDirectedPenalty, type PowerEffects } from '@/types';

/**
 * Check if a power has a Heal-type damage entry (one-shot heals/drains).
 * Powers like Dark Regeneration, Dull Pain, Life Drain have these.
 */
export function hasHealingDamage(power: { damage?: unknown }): boolean {
  if (!power.damage) return false;
  if (Array.isArray(power.damage)) {
    return power.damage.some((d: { type?: string }) => d.type === 'Heal');
  }
  return (power.damage as { type?: string }).type === 'Heal';
}

/**
 * Effect keys whose presence implies a persistent buff/effect applied to the caster.
 * Used to gate the toggle UI for click powers — only powers with at least one of these
 * keys (or a self-directed `toWho:'Self'` debuff) get a toggle.
 *
 * Includes the *Buff-suffixed fields plus unsuffixed top-level fields some powers use
 * (Healing Flames stores `resistance.toxic`, not `resistanceBuff`).
 */
const CASTER_BUFF_KEYS = [
  // Standard *Buff fields
  'tohitBuff', 'tohitBuffUnenhanced', 'damageBuff', 'defenseBuff', 'defenseBuffSuppressible',
  'rechargeBuff', 'recoveryBuff', 'recoveryBuffUnenhanced', 'regenBuff', 'regenBuffUnenhanced',
  'speedBuff', 'enduranceBuff', 'enduranceGain', 'maxHPBuff', 'maxEndBuff',
  'rangeBuff', 'enduranceDiscount', 'threatBuff', 'perceptionBuff', 'absorb',
  // Unsuffixed top-level fields (used by some powers in place of *Buff)
  'defense', 'resistance',
  // +Strength self-buff container (Power Boost family). The whole point of
  // toggling these is to apply their strength to your other powers, so they
  // must be activatable even though they carry no flat *Buff fields.
  'specialBuff',
  // Movement buffs
  'runSpeed', 'flySpeed', 'jumpHeight', 'jumpSpeed', 'fly',
  'movementControl', 'movementFriction',
  // Stealth
  'stealthPvE', 'stealthPvP', 'translucency',
  // Mez/debuff resistance (mezResistance, debuffResistance)
  'mezResistance', 'debuffResistance',
];

/** targetType values where the power cannot be cast on self — buffs go to allies only. */
const ALLY_ONLY_TARGETS = new Set(['ally', 'ally (alive)']);

/**
 * `mezResistance` and `debuffResistance` are sub-keyed containers, so their mere
 * presence proves nothing — the calc routes them per subtype and silently drops
 * subtypes it has no total for. A power whose only "caster buff" is an unrouted
 * subtype gets a toggle that cannot move a single number.
 *
 * Reported 2026-07-30: Fold Space had a toggle that did nothing. Its bag carries
 * `mezResistance.teleport` — which is the *foes'* 15s teleport protection (so they
 * can't be chain-yanked), not a caster buff, and there is no teleport-resistance
 * total for it to reach either. Same for Rebirth's Mass Translocate and
 * Thunderspy's Teleport Foe.
 *
 * These lists mirror `mezResMapping` / `debuffResMapping` in
 * `src/utils/calculations/legacy-totals.oracle.ts` (and their Rust twins in
 * `coh_math`); `power-row-utils.test.ts` pins them in sync.
 *
 * Note this is deliberately a routability test, not a `toWho` test: Aid Self also
 * stamps `toWho: 'Target'` on its `mezResistance.stun`, but it is a self-cast
 * single-target power where the target *is* the caster, and `stun` does route.
 */
export const ROUTED_SUBTYPES: Record<string, Set<string>> = {
  mezResistance: new Set([
    'hold', 'stun', 'immobilize', 'sleep', 'confuse', 'fear', 'knockback',
  ]),
  debuffResistance: new Set([
    'movement', 'defense', 'recharge', 'endurance', 'recovery', 'tohit',
    'regeneration', 'perception',
  ]),
};

/**
 * True when a caster-buff key carries something the calc can actually consume.
 * Only the sub-keyed resistance containers are scrutinised; every other key is
 * a scalar or `*Buff` field whose presence is itself the signal.
 */
function keyCarriesUsableEffect(key: string, effects: Record<string, unknown>): boolean {
  const routed = ROUTED_SUBTYPES[key];
  if (!routed) return true;
  const container = effects[key];
  if (!container || typeof container !== 'object') return false;
  return Object.keys(container as Record<string, unknown>).some((subtype) =>
    routed.has(subtype.toLowerCase()),
  );
}

function isDamagingAttack(power: { damage?: unknown }): boolean {
  // True when the power directly deals damage to enemies. The shared check
  // below uses this to skip the per-cast `damageBuff` field on attack
  // powers — that field encodes Defiance / Containment / Combo-Mastery
  // procs, not a persistent self-buff worth tracking via a toggle. Heal-
  // type damage entries (Dull Pain, Dark Regeneration) don't count as
  // attacks here.
  if (!power.damage) return false;
  const entries = Array.isArray(power.damage) ? power.damage : [power.damage];
  return entries.some((d) => {
    const entry = d as { type?: string; scale?: number };
    return entry?.type !== 'Heal' && (entry?.scale ?? 0) > 0;
  });
}

function hasPersistentBuffEffects(power: { effects?: object; damage?: unknown }, isSelf: boolean): boolean {
  if (!power.effects) return false;
  const effects = power.effects as Record<string, unknown>;
  // A self-directed penalty (Granite Armor's -damage etc., toWho:'Self') is a
  // real caster effect — such click powers get a toggle.
  if (hasSelfDirectedPenalty(power.effects as PowerEffects)) return true;
  // Damage attacks: damageBuff is a per-cast Defiance proc, and rangeBuff
  // is the Fast Snipe per-power range bump (gated on ≥22% ToHit buff in
  // game). Neither is a persistent caster buff worth toggling at the
  // build level — Fast Snipe state is the right knob for snipe damage/
  // range, not a generic active-power flag. Real persistent self-buffs
  // (resistance, defense, mez resistance, etc.) on the same power still
  // trigger the toggle.
  const skip = isDamagingAttack(power) ? new Set(['damageBuff', 'rangeBuff']) : new Set<string>();
  // `specialBuff` (the +Strength container) only implies a *caster* buff when
  // the power is self-targeted. Legacy foe -Special debuffs (Benumb, Weaken,
  // Time Stop) store a positive `specialBuff` on a Foe-targeted power — those
  // must not gain a self-buff toggle.
  if (!isSelf) skip.add('specialBuff');
  return CASTER_BUFF_KEYS.some(
    key => key in effects && !skip.has(key) && keyCarriesUsableEffect(key, effects),
  );
}

function affectsCaster(power: { targetType?: string }): boolean {
  if (!power.targetType) return true;
  return !ALLY_ONLY_TARGETS.has(power.targetType.toLowerCase());
}

/**
 * Determine if a power should show a toggle switch for stat calculations.
 * - Toggle powers (always)
 * - Click powers with persistent buff effects that apply to the caster
 *   (Build Up, Aim, Hasten, Healing Flames, Vengeance, Granite Armor's self-penalty, etc.)
 * - Excluded: ally-only buffs (Speed Boost, Fortitude), one-shot damage/heal-only
 *   clicks (Inferno, Dark Regeneration), interruptible snipes (no persistent caster buff)
 */
export function shouldShowToggle(power: {
  powerType?: string;
  targetType?: string;
  shortHelp?: string;
  damage?: unknown;
  effects?: object;
}): boolean {
  const powerType = power.powerType?.toLowerCase();
  if (powerType === 'toggle') return true;
  if (powerType !== 'click') return false;
  if (!affectsCaster(power)) return false;
  const isSelf = !power.targetType || power.targetType.toLowerCase() === 'self';
  return hasPersistentBuffEffects(power, isSelf);
}
