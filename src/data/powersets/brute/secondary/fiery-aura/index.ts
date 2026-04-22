/**
 * Fiery Aura Powerset
 * You can engulf yourself in protective flames. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is the most offensive of the Brute's defensive Power Sets, offering some damage output.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/fiery_aura
 */

import type { Powerset } from '@/types';

import { BlazingAura as BlazingAura } from './blazing-aura';
import { Burn as Burn } from './burn';
import { Consume as Consume } from './consume';
import { FieryEmbrace as FieryEmbrace } from './fiery-embrace';
import { FireShield as FireShield } from './fire-shield';
import { HealingFlames as HealingFlames } from './healing-flames';
import { PhoenixRising as PhoenixRising } from './phoenix-rising';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { PhoenixRising as PhoenixRising2 } from './rise-of-the-phoenix';
import { TemperatureProtection as TemperatureProtection } from './temperature-protection';

export const powerset: Powerset = {
  id: 'brute/fiery-aura',
  name: 'Fiery Aura',
  description: 'You can engulf yourself in protective flames. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is the most offensive of the Brute\'s defensive Power Sets, offering some damage output.',
  icon: 'fiery_aura_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    BlazingAura,
    Burn,
    Consume,
    FieryEmbrace,
    FireShield,
    HealingFlames,
    PhoenixRising,
    PlasmaShield,
    PhoenixRising2,
    TemperatureProtection,
  ],
};

export default powerset;
