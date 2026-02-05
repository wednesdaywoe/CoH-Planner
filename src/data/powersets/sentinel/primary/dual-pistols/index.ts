/**
 * Dual Pistols Powerset
 * You're a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/dual_pistols
 */

import type { Powerset } from '@/types';

import { ChemicalAmmunition as ChemicalAmmunition } from './chemical-ammunition';
import { CryoAmmunition as CryoAmmunition } from './cryo-ammunition';
import { IncendiaryAmmunition as IncendiaryAmmunition } from './incendiary-ammunition';
import { DualWield as DualWield } from './dual-wield';
import { Pistols as Pistols } from './pistols';
import { EmptyClips as EmptyClips } from './empty-clips';
import { SuppressiveFire as SuppressiveFire } from './suppressive-fire';
import { SwapAmmo as SwapAmmo } from './swap-ammo';
import { BulletRain as BulletRain } from './bullet-rain';
import { ExecutionersShot as ExecutionersShot } from './executioner-s-shot';
import { PiercingRounds as PiercingRounds } from './piercing-rounds';
import { HailofBullets as HailofBullets } from './hail-of-bullets';

export const powerset: Powerset = {
  id: 'sentinel/dual-pistols',
  name: 'Dual Pistols',
  description: 'You\'re a master of akimbo pistols, wielding a high caliber firearm in each hand. Your attacks primarily deal lethal damage and you have a wide variety of attacks, however your strength lies within your ability to use your "Swap Ammo" power to change out your ammo mid-battle. Doing so can change your secondary damage type and effects making you an incredibly versatile ranged combatant.',
  icon: 'dual_pistols_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    ChemicalAmmunition,
    CryoAmmunition,
    IncendiaryAmmunition,
    DualWield,
    Pistols,
    EmptyClips,
    SuppressiveFire,
    SwapAmmo,
    BulletRain,
    ExecutionersShot,
    PiercingRounds,
    HailofBullets,
  ],
};

export default powerset;
