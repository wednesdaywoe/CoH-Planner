/**
 * Titan Weapons Powerset
 * You wield an over-sized weapon of some sort; a gigantic sword, mace or axe or possibly even a railroad crossing sign. The weapon's sheer mass gives it great destructive power, and your immense strength and skill allow you to use it as a devastating weapon. Titan Weapons as a set, has exceptional area of effect capability, while retaining a strong single target ability. Certain powers can only be used as follow up attacks and are grayed out when first entering combat, while others allow you to build up momentum and accelerate your attack speed for a few moments. Momentum is gained by using a Titan Weapon power when you don't already have Momentum. This effect lasts for 5 seconds. Once Momentum wears off, another Titan Weapon attack must be used to grant Momentum again.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/titan_weapons
 */

import type { Powerset } from '@/types';

import { CrushingBlow as CrushingBlow } from './crushing-blow';
import { DefensiveSweep as DefensiveSweep } from './defensive-sweep';
import { TitanSweep as TitanSweep } from './titan-sweep';
import { Taunt as Taunt } from './taunt';
import { FollowThrough as FollowThrough } from './follow-through';
import { BuildMomentum as BuildMomentum } from './build-momentum';
import { RendArmor as RendArmor } from './rend-armor';
import { WhirlingSmash as WhirlingSmash } from './whirling-smash';
import { ArcofDestruction as ArcofDestruction } from './arc-of-destruction';

export const powerset: Powerset = {
  id: 'tanker/titan-weapons',
  name: 'Titan Weapons',
  description: 'You wield an over-sized weapon of some sort; a gigantic sword, mace or axe or possibly even a railroad crossing sign. The weapon\'s sheer mass gives it great destructive power, and your immense strength and skill allow you to use it as a devastating weapon. Titan Weapons as a set, has exceptional area of effect capability, while retaining a strong single target ability. Certain powers can only be used as follow up attacks and are grayed out when first entering combat, while others allow you to build up momentum and accelerate your attack speed for a few moments. Momentum is gained by using a Titan Weapon power when you don\'t already have Momentum. This effect lasts for 5 seconds. Once Momentum wears off, another Titan Weapon attack must be used to grant Momentum again.',
  icon: 'titan_weapons_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    CrushingBlow,
    DefensiveSweep,
    TitanSweep,
    Taunt,
    FollowThrough,
    BuildMomentum,
    RendArmor,
    WhirlingSmash,
    ArcofDestruction,
  ],
};

export default powerset;
