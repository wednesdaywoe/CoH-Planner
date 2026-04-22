/**
 * Fiery Aura Powerset
 * Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/fiery_aura
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
  id: 'scrapper/fiery-aura',
  name: 'Fiery Aura',
  description: 'Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.',
  icon: 'fiery_aura_set.ico',
  archetype: 'scrapper',
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
