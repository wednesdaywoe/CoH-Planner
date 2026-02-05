/**
 * Ice Armor Powerset
 * You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/ice_armor
 */

import type { Powerset } from '@/types';

import { FrozenArmor as FrozenArmor } from './frozen-armor';
import { Hoarfrost as Hoarfrost } from './hoarfrost';
import { Rime as Rime } from './rime';
import { WetIce as WetIce } from './wet-ice';
import { FrigidShield as FrigidShield } from './frigid-shield';
import { MoistureAbsorption as MoistureAbsorption } from './moisture-absorption';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { Permafrost as Permafrost } from './permafrost';
import { FrostProtection as FrostProtection } from './frost-protection';
import { IcyBastion as IcyBastion } from './icy-bastion';

export const powerset: Powerset = {
  id: 'sentinel/ice-armor',
  name: 'Ice Armor',
  description: 'You can dramatically reduce your core body temperature to form various armors of ice around yourself. You can protect yourself from many different damage types, and you gain exceptional resistance to Cold based attacks. However, this set offers little protection to Fire based powers and no protection against Psionics.',
  icon: 'ice_armor_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    FrozenArmor,
    Hoarfrost,
    Rime,
    WetIce,
    FrigidShield,
    MoistureAbsorption,
    GlacialArmor,
    Permafrost,
    FrostProtection,
    IcyBastion,
  ],
};

export default powerset;
