/**
 * Shared utilities for power row rendering
 * Consolidates shouldShowToggle, hasHealingDamage, and getInherentIconPath
 * that were previously duplicated across multiple components.
 */

import type { SelectedPower } from '@/types';
import { resolvePath } from '@/utils/paths';

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
 * Determine if a power should show a toggle switch for stat calculations.
 * - Toggle powers (always toggleable)
 * - Click powers that target self (Build Up, Aim, Hasten, etc.)
 * - Excludes one-shot heals/drains (Dark Regeneration, Dull Pain, etc.)
 */
export function shouldShowToggle(power: {
  powerType?: string;
  targetType?: string;
  shortHelp?: string;
  damage?: unknown;
}): boolean {
  const powerType = power.powerType?.toLowerCase();
  const targetType = power.targetType?.toLowerCase();
  const shortHelp = power.shortHelp?.toLowerCase() || '';

  if (powerType === 'toggle') return true;

  if (powerType === 'click') {
    if (hasHealingDamage(power)) return false;
    if (targetType === 'self') return true;
    if (shortHelp.startsWith('self ') || shortHelp.includes('self +')) return true;
  }

  return false;
}

/** Get the icon path for an inherent power based on its category */
export function getInherentIconPath(power: SelectedPower): string {
  const category = power.inherentCategory || 'basic';
  const lowercaseIcon = power.icon?.toLowerCase() || 'unknown.png';

  switch (category) {
    case 'fitness':
      return resolvePath(`/img/Powers/Fitness Powers Icons/${lowercaseIcon}`);
    case 'archetype':
      return resolvePath(`/img/Powers/Archetype Inherent Powers icons/${lowercaseIcon}`);
    case 'prestige':
    case 'basic':
    default:
      return resolvePath(`/img/Powers/Inherent Powers Icons/${lowercaseIcon}`);
  }
}
