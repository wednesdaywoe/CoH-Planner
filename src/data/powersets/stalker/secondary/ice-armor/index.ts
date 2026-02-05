/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { FrozenArmor as FrozenArmor } from './frozen-armor';
import { Hide as Hide } from './hide';
import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { Rime as Rime } from './rime';
import { WetIce as WetIce } from './wet-ice';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { Permafrost as Permafrost } from './permafrost';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { EnergyAbsorption as EnergyAbsorption } from './energy-absorption';
import { IcyBastion as IcyBastion } from './icy-bastion';

export const powerset: Powerset = {
  id: 'stalker/ice-armor',
  name: 'Ice Armor',
  description: 'You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.',
  icon: 'ice_armor_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    FrozenArmor,
    Hide,
    Hoarfrost,
    Rime,
    WetIce,
    ChillingEmbrace,
    Permafrost,
    GlacialArmor,
    EnergyAbsorption,
    IcyBastion,
  ],
};

export default powerset;
