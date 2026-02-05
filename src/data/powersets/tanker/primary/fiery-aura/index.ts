/**
 * Fiery Aura Powerset
 * Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is the most offensive of the Tanker's defensive Power Sets, offering some damage output.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/fiery_aura
 */

import type { Powerset } from '@/types';

import { BlazingAura as BlazingAura } from './blazing-aura';
import { FireShield as FireShield } from './fire-shield';
import { PhoenixRising as PhoenixRising } from './phoenix-rising';
import { HealingFlames as HealingFlames } from './healing-flames';
import { TemperatureProtection as TemperatureProtection } from './temperature-protection';
import { Consume as Consume } from './consume';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { Burn as Burn } from './burn';
import { FieryEmbrace as FieryEmbrace } from './fiery-embrace';
import { PhoenixRising as PhoenixRising2 } from './phoenix-rising';

export const powerset: Powerset = {
  id: 'tanker/fiery-aura',
  name: 'Fiery Aura',
  description: 'Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is the most offensive of the Tanker\'s defensive Power Sets, offering some damage output.',
  icon: 'fiery_aura_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    BlazingAura,
    FireShield,
    PhoenixRising,
    HealingFlames,
    TemperatureProtection,
    Consume,
    PlasmaShield,
    Burn,
    FieryEmbrace,
    PhoenixRising2,
  ],
};

export default powerset;
