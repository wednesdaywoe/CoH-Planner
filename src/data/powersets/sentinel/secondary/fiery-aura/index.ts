/**
 * Fiery Aura Powerset
 * Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/fiery_aura
 */

import type { Powerset } from '@/types';

import { Burn as Burn } from './burn';
import { CauterizingBlaze as CauterizingBlaze } from './cauterizing-blaze';
import { Consume as Consume } from './consume';
import { FireShield as FireShield } from './fire-shield';
import { HealingFlames as HealingFlames } from './healing-flames';
import { MoltenEmbrace as MoltenEmbrace } from './molten-embrace';
import { PhoenixRising as PhoenixRising } from './phoenix-rising';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { PhoenixRising as PhoenixRising2 } from './rise-of-the-phoenix';
import { TemperatureProtection as TemperatureProtection } from './temperature-protection';

export const powerset: Powerset = {
  id: 'sentinel/fiery-aura',
  name: 'Fiery Aura',
  description: 'Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.',
  icon: 'fiery_aura_set.ico',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    Burn,
    CauterizingBlaze,
    Consume,
    FireShield,
    HealingFlames,
    MoltenEmbrace,
    PhoenixRising,
    PlasmaShield,
    PhoenixRising2,
    TemperatureProtection,
  ],
};

export default powerset;
