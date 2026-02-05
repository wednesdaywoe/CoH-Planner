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
import { FireShield as FireShield } from './fire-shield';
import { PhoenixRising as PhoenixRising } from './phoenix-rising';
import { HealingFlames as HealingFlames } from './healing-flames';
import { TemperatureProtection as TemperatureProtection } from './temperature-protection';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { Consume as Consume } from './consume';
import { Burn as Burn } from './burn';
import { FieryEmbrace as FieryEmbrace } from './fiery-embrace';
import { PhoenixRising as PhoenixRising2 } from './phoenix-rising';

export const powerset: Powerset = {
  id: 'scrapper/fiery-aura',
  name: 'Fiery Aura',
  description: 'Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.',
  icon: 'fiery_aura_set.png',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    BlazingAura,
    FireShield,
    PhoenixRising,
    HealingFlames,
    TemperatureProtection,
    PlasmaShield,
    Consume,
    Burn,
    FieryEmbrace,
    PhoenixRising2,
  ],
};

export default powerset;
