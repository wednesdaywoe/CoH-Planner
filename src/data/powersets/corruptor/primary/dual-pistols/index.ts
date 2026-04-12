/**
 * Dual Pistols Powerset
 * You're a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/dual_pistols
 */

import type { Powerset } from '@/types';

import { Pistols as Pistols } from './pistols';
import { DualWield as DualWield } from './dual-wield';
import { EmptyClips as EmptyClips } from './empty-clips';
import { SwapAmmo as SwapAmmo } from './swap-ammo';
import { CryoAmmunition as CryoAmmunition } from './cryo-ammunition';
import { IncendiaryAmmunition as IncendiaryAmmunition } from './incendiary-ammunition';
import { ChemicalAmmunition as ChemicalAmmunition } from './chemical-ammunition';
import { BulletRain as BulletRain } from './bullet-rain';
import { SuppressiveFire as SuppressiveFire } from './suppressive-fire';
import { ExecutionersShot as ExecutionersShot } from './executioners-shot';
import { PiercingRounds as PiercingRounds } from './piercing-rounds';
import { HailofBullets as HailofBullets } from './hail-of-bullets';

export const powerset: Powerset = {
  id: 'corruptor/dual-pistols',
  name: 'Dual Pistols',
  description: 'You\'re a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.',
  icon: 'dual_pistols_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Pistols,
    DualWield,
    EmptyClips,
    SwapAmmo,
    CryoAmmunition,
    IncendiaryAmmunition,
    ChemicalAmmunition,
    BulletRain,
    SuppressiveFire,
    ExecutionersShot,
    PiercingRounds,
    HailofBullets,
  ],
};

export default powerset;
