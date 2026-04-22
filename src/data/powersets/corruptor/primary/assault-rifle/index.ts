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
import { Buckshot as Buckshot } from './buckshot';
import { Burst as Burst } from './burst';
import { Flamethrower as Flamethrower } from './flamethrower';
import { FullAuto as FullAuto } from './full-auto';
import { Ignite as Ignite } from './ignite';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Slug as Slug } from './slug';
import { SniperRifle as SniperRifle } from './sniper-rifle';

export const powerset: Powerset = {
  id: 'corruptor/assault-rifle',
  name: 'Assault Rifle',
  description: 'The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.',
  icon: 'assault_rifle_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Beanbag,
    Buckshot,
    Burst,
    Flamethrower,
    FullAuto,
    Ignite,
    M30Grenade,
    Slug,
    SniperRifle,
  ],
};

export default powerset;
