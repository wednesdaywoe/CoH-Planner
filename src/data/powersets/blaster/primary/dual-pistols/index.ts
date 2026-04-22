/**
 * Dual Pistols Powerset
 * You're a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/dual_pistols
 */

import type { Powerset } from '@/types';

import { BulletRain as BulletRain } from './bullet-rain';
import { ChemicalAmmunition as ChemicalAmmunition } from './chemical-ammunition';
import { CryoAmmunition as CryoAmmunition } from './cryo-ammunition';
import { DualWield as DualWield } from './dual-wield';
import { EmptyClips as EmptyClips } from './empty-clips';
import { ExecutionersShot as ExecutionersShot } from './executioners-shot';
import { HailofBullets as HailofBullets } from './hail-of-bullets';
import { IncendiaryAmmunition as IncendiaryAmmunition } from './incendiary-ammunition';
import { PiercingRounds as PiercingRounds } from './piercing-rounds';
import { Pistols as Pistols } from './pistols';
import { SuppressiveFire as SuppressiveFire } from './suppressive-fire';
import { SwapAmmo as SwapAmmo } from './swap-ammo';

export const powerset: Powerset = {
  id: 'blaster/dual-pistols',
  name: 'Dual Pistols',
  description: 'You\'re a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.',
  icon: 'dual_pistols_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    BulletRain,
    ChemicalAmmunition,
    CryoAmmunition,
    DualWield,
    EmptyClips,
    ExecutionersShot,
    HailofBullets,
    IncendiaryAmmunition,
    PiercingRounds,
    Pistols,
    SuppressiveFire,
    SwapAmmo,
  ],
};

export default powerset;
