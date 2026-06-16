/**
 * Akimbo Assault Powerset
 * You're a master of akimbo pistols, wielding a high caliber firearm in each hand.  Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle.  Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/dual_pistols
 */

import type { Powerset } from '@/types';

import { Pistols as Pistols } from './pistols';
import { PistolWhip as PistolWhip } from './pistol-whip';
import { DualWield as DualWield } from './dual-wield';
import { BulletRain as BulletRain } from './bullet-rain';
import { PowerBuildUp as PowerBuildUp } from './power-build-up';
import { HailofBullets as HailofBullets } from './hail-of-bullets';
import { ExecutionersShot as ExecutionersShot } from './executioners-shot';
import { Reactiontime as Reactiontime } from './reaction-time';
import { PiercingRounds as PiercingRounds } from './piercing-rounds';

export const powerset: Powerset = {
  id: 'dominator/akimbo-assault',
  name: 'Akimbo Assault',
  description: 'You\'re a master of akimbo pistols, wielding a high caliber firearm in each hand.  Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle.  Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.',
  icon: 'dual_pistols_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Pistols,
    PistolWhip,
    DualWield,
    BulletRain,
    PowerBuildUp,
    HailofBullets,
    ExecutionersShot,
    Reactiontime,
    PiercingRounds,
  ],
};

export default powerset;
