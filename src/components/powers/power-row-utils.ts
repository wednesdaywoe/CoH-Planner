/**
 * Shared utilities for power row rendering
 * Consolidates shouldShowToggle and hasHealingDamage
 * that were previously duplicated across multiple components.
 */

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

/** Known buff effect keys that indicate persistent toggleable effects */
const BUFF_EFFECT_KEYS = [
  'rechargeBuff', 'recoveryBuff', 'damageBuff', 'defenseBuff',
  'resistanceBuff', 'tohitBuff', 'enduranceGain', 'speedBuff',
];

/**
 * Check if a power has persistent buff effects (e.g. Chrono Shift's +Recharge, +Recovery).
 * Powers with these should still get a toggle even if they also have healing damage.
 */
function hasPersistentBuffEffects(power: { effects?: object }): boolean {
  if (!power.effects) return false;
  return BUFF_EFFECT_KEYS.some(key => key in power.effects!);
}

/**
 * Determine if a power should show a toggle switch for stat calculations.
 * - Toggle powers (always toggleable)
 * - Click powers that target self (Build Up, Aim, Hasten, Shadow Meld, Rune of Protection, etc.)
 * - Click team buffs that also buff the caster (Vengeance, Tactical Training: Vengeance, etc.)
 * - Excludes one-shot heals/drains (Dark Regeneration, Dull Pain, etc.)
 *   unless the power also has persistent buff effects (Chrono Shift)
 */
export function shouldShowToggle(power: {
  powerType?: string;
  targetType?: string;
  shortHelp?: string;
  damage?: unknown;
  effects?: object;
}): boolean {
  const powerType = power.powerType?.toLowerCase();
  const targetType = power.targetType?.toLowerCase();
  const shortHelp = power.shortHelp?.toLowerCase() || '';

  if (powerType === 'toggle') return true;

  if (powerType === 'click') {
    if (hasHealingDamage(power) && !hasPersistentBuffEffects(power)) return false;
    if (targetType === 'self') return true;
    // shortHelp starting with "self" followed by any separator (space, colon, comma, etc.)
    // covers "Self +DMG", "Self: +Def(All)", "Self, +Res(All Dmg)", etc.
    if (/^self\b/.test(shortHelp)) return true;
    if (shortHelp.includes('self +')) return true;
    // Team buffs that also apply to the caster (Vengeance, Tactical Training: Vengeance).
    // Excluded when the power is flagged as ally-only (defenseBuffExcludesSelf).
    if (
      hasPersistentBuffEffects(power) &&
      !(power.effects as { defenseBuffExcludesSelf?: boolean })?.defenseBuffExcludesSelf
    ) {
      return true;
    }
  }

  return false;
}
