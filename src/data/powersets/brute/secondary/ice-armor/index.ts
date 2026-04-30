/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { FrozenArmor as FrozenArmor } from './ice-armor';
import { Rime as Rime } from './rime-ice';
import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { WetIce as WetIce } from './wet-ice';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { EnergyAbsorption as EnergyAbsorption } from './energy-absorption';
import { Permafrost as Permafrost } from './permafrost';
import { Icicles as Icicles } from './icicles';
import { IcyBastion as IcyBastion } from './hibernate';

export const powerset: Powerset = {
  id: 'brute/ice-armor',
  name: 'Ice Armor',
  description: 'You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.',
  icon: 'ice_armor_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    FrozenArmor,
    Rime,
    Hoarfrost,
    ChillingEmbrace,
    WetIce,
    GlacialArmor,
    EnergyAbsorption,
    Permafrost,
    Icicles,
    IcyBastion,
  ],
};

export default powerset;
