/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { Permafrost as Permafrost } from './permafrost';
import { IceArmor as IceArmor } from './ice-armor';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { WetIce as WetIce } from './wet-ice';
import { Icicles as Icicles } from './icicles';
import { EnergyAbsorption as EnergyAbsorption } from './energy-absorption';
import { Hibernate as Hibernate } from './hibernate';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';

export const powerset: Powerset = {
  id: 'tanker/ice-armor',
  setPath: 'Tanker_Defense.Ice_Armor',
  name: 'Ice Armor',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.",
  icon: 'ice_armor_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    Permafrost,
    IceArmor,
    GlacialArmor,
    Hoarfrost,
    WetIce,
    Icicles,
    EnergyAbsorption,
    Hibernate,
    ChillingEmbrace,
  ],
};

export default powerset;
