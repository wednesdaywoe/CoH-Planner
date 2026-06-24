/**
 * Fiery Aura Powerset
 * Through intense heat and fire, you can absorb many kinds of damage.  Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is the most offensive of the Tanker's defensive Power Sets, offering some damage output.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/fiery_aura
 */

import type { Powerset } from '@/types';

import { BlazingAura as BlazingAura } from './blazing-aura';
import { FireShield as FireShield } from './fire-shield';
import { SolApex as SolApex } from './sol-apex';
import { HealingFlames as HealingFlames } from './healing-flames';
import { Temperatureprotection as Temperatureprotection } from './temperature-protection';
import { Consume as Consume } from './consume';
import { PlasmaSheild as PlasmaSheild } from './plasma-sheild';
import { Burn as Burn } from './burn';
import { FieryEmbrace as FieryEmbrace } from './fiery-embrace';
import { RiseofthePhoenix as RiseofthePhoenix } from './rise-of-the-phoenix';

export const powerset: Powerset = {
  id: 'tanker/fiery-aura',
  name: 'Fiery Aura',
  description: 'Through intense heat and fire, you can absorb many kinds of damage.  Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is the most offensive of the Tanker\'s defensive Power Sets, offering some damage output.',
  icon: 'fiery_aura_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    BlazingAura,
    FireShield,
    SolApex,
    HealingFlames,
    Temperatureprotection,
    Consume,
    PlasmaSheild,
    Burn,
    FieryEmbrace,
    RiseofthePhoenix,
  ],
};

export default powerset;
