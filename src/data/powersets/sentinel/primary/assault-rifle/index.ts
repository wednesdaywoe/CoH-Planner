/**
 * Assault Rifle Powerset
 * The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/assault_rifle
 */

import type { Powerset } from '@/types';

import { DisorientingShot as DisorientingShot } from './disorienting-shot';
import { Burst as Burst } from './burst';
import { Buckshot as Buckshot } from './buckshot';
import { Slug as Slug } from './slug';
import { Aim as Aim } from './aim';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Flamethrower as Flamethrower } from './flamethrower';
import { Ignite as Ignite } from './ignite';
import { FullAuto as FullAuto } from './full-auto';

export const powerset: Powerset = {
  id: 'sentinel/assault-rifle',
  name: 'Assault Rifle',
  description: 'The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.',
  icon: 'assault_rifle_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    DisorientingShot,
    Burst,
    Buckshot,
    Slug,
    Aim,
    M30Grenade,
    Flamethrower,
    Ignite,
    FullAuto,
  ],
};

export default powerset;
