/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { Permafrost as Permafrost } from './permafrost';
import { FrozenArmor as FrozenArmor } from './frozen-armor';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { WetIce as WetIce } from './wet-ice';
import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { EnergyAbsorption as EnergyAbsorption } from './energy-absorption';
import { Hide as Hide } from './hide';
import { IcyBastion as IcyBastion } from './icy-bastion';

export const powerset: Powerset = {
  id: 'stalker/ice-armor',
  setPath: 'Stalker_Defense.Ice_Armor',
  name: 'Ice Armor',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.',
  icon: 'ice_armor_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Permafrost,
    FrozenArmor,
    GlacialArmor,
    WetIce,
    Hoarfrost,
    ChillingEmbrace,
    EnergyAbsorption,
    Hide,
    IcyBastion,
  ],
};

export default powerset;
