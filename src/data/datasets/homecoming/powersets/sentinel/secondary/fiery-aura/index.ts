/**
 * Fiery Aura Powerset
 * Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/fiery_aura
 */

import type { Powerset } from '@/types';

import { FireShield as FireShield } from './fire-shield';
import { MoltenEmbrace as MoltenEmbrace } from './molten-embrace';
import { HealingFlames as HealingFlames } from './healing-flames';
import { TemperatureProtection as TemperatureProtection } from './temperature-protection';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { Consume as Consume } from './consume';
import { Burn as Burn } from './burn';
import { CauterizingBlaze as CauterizingBlaze } from './cauterizing-blaze';
import { RiseofthePhoenix as RiseofthePhoenix } from './rise-of-the-phoenix';

export const powerset: Powerset = {
  id: 'sentinel/fiery-aura',
  setPath: 'Sentinel_Defense.Fiery_Aura',
  name: 'Fiery Aura',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Through intense heat and fire, you can absorb many kinds of damage. Fiery Aura offers superior resistance to Fire damage, but weak resistance to Cold damage and no protection to Knockback. Fiery Aura is an offensive oriented Power Set, offering some damage output.",
  icon: 'fiery_aura_set.ico',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    FireShield,
    MoltenEmbrace,
    HealingFlames,
    TemperatureProtection,
    PlasmaShield,
    Consume,
    Burn,
    CauterizingBlaze,
    RiseofthePhoenix,
  ],
};

export default powerset;
