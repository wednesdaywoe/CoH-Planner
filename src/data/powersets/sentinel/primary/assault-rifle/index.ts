/**
 * Assault Rifle Powerset
 * The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/assault_rifle
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { DisorientingShot as DisorientingShot } from './beanbag';
import { Buckshot as Buckshot } from './buckshot';
import { Burst as Burst } from './burst';
import { Flamethrower as Flamethrower } from './flamethrower';
import { FullAuto as FullAuto } from './full-auto';
import { Ignite as Ignite } from './incinerator';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Slug as Slug } from './slug';

export const powerset: Powerset = {
  id: 'sentinel/assault-rifle',
  name: 'Assault Rifle',
  description: 'The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.',
  icon: 'assault_rifle_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Aim,
    DisorientingShot,
    Buckshot,
    Burst,
    Flamethrower,
    FullAuto,
    Ignite,
    M30Grenade,
    Slug,
  ],
};

export default powerset;
