/**
 * Assault Rifle Powerset
 * The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/assault_rifle
 */

import type { Powerset } from '@/types';

import { Beanbag as Beanbag } from './beanbag';
import { Burst as Burst } from './burst';
import { Buckshot as Buckshot } from './buckshot';
import { Slug as Slug } from './slug';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Aim as Aim } from './aim';
import { Flamethrower as Flamethrower } from './flamethrower';
import { SniperRifle as SniperRifle } from './sniper-rifle';
import { FullAuto as FullAuto } from './full-auto';

export const powerset: Powerset = {
  id: 'corruptor/assault-rifle',
  internalName: 'assault_rifle',
  name: 'Assault Rifle',
  description: 'The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.',
  icon: 'assault_rifle_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Beanbag,
    Burst,
    Buckshot,
    Slug,
    M30Grenade,
    Aim,
    Flamethrower,
    SniperRifle,
    FullAuto,
  ],
};

export default powerset;
