/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { EnergyAbsorption as EnergyAbsorption } from './energy-absorption';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { FrozenArmor as FrozenArmor } from './ice-armor';
import { Icicles as Icicles } from './icicles';
import { IcyBastion as IcyBastion } from './icy-bastion';
import { Permafrost as Permafrost } from './permafrost';
import { Rime as Rime } from './rime-ice';
import { WetIce as WetIce } from './wet-ice';

export const powerset: Powerset = {
  id: 'scrapper/ice-armor',
  name: 'Ice Armor',
  description: 'You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.',
  icon: 'ice_armor_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    ChillingEmbrace,
    EnergyAbsorption,
    GlacialArmor,
    Hoarfrost,
    FrozenArmor,
    Icicles,
    IcyBastion,
    Permafrost,
    Rime,
    WetIce,
  ],
};

export default powerset;
