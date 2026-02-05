/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { FrozenArmor as FrozenArmor } from './frozen-armor';
import { Rime as Rime } from './rime';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { WetIce as WetIce } from './wet-ice';
import { Permafrost as Permafrost } from './permafrost';
import { Icicles as Icicles } from './icicles';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { EnergyAbsorption as EnergyAbsorption } from './energy-absorption';
import { IcyBastion as IcyBastion } from './icy-bastion';

export const powerset: Powerset = {
  id: 'tanker/ice-armor',
  name: 'Ice Armor',
  description: 'You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.',
  icon: 'ice_armor_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    Hoarfrost,
    FrozenArmor,
    Rime,
    ChillingEmbrace,
    WetIce,
    Permafrost,
    Icicles,
    GlacialArmor,
    EnergyAbsorption,
    IcyBastion,
  ],
};

export default powerset;
