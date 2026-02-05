/**
 * Assault Rifle Powerset
 * The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/assault_rifle
 */

import type { Powerset } from '@/types';

import { Burst as Burst } from './burst';
import { Slug as Slug } from './slug';
import { Buckshot as Buckshot } from './buckshot';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Beanbag as Beanbag } from './beanbag';
import { SniperRifle as SniperRifle } from './sniper-rifle';
import { Flamethrower as Flamethrower } from './flamethrower';
import { Ignite as Ignite } from './ignite';
import { FullAuto as FullAuto } from './full-auto';

export const powerset: Powerset = {
  id: 'defender/assault-rifle',
  name: 'Assault Rifle',
  description: 'The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.',
  icon: 'assault_rifle_set.png',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Burst,
    Slug,
    Buckshot,
    M30Grenade,
    Beanbag,
    SniperRifle,
    Flamethrower,
    Ignite,
    FullAuto,
  ],
};

export default powerset;
