/**
 * Assault Rifle Powerset
 * The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/assault_rifle
 */

import type { Powerset } from '@/types';

import { Burst as Burst } from './burst';
import { Beanbag as Beanbag } from './beanbag';
import { Buckshot as Buckshot } from './buckshot';
import { Slug as Slug } from './slug';
import { Aim as Aim } from './aim';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Flamethrower as Flamethrower } from './flamethrower';
import { Incinerator as Incinerator } from './incinerator';
import { FullAuto as FullAuto } from './full-auto';

export const powerset: Powerset = {
  id: 'sentinel/assault-rifle',
  setPath: 'Sentinel_Ranged.Assault_Rifle',
  name: 'Assault Rifle',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'The Assault Rifle is a state-of-the-art piece of hardware. It is equipped to handle an impressive arsenal of munitions and firing modes. The Assault Rifle is also equipped with the latest in targeting technology, and is a very accurate weapon.',
  icon: 'assault_rifle_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Burst,
    Beanbag,
    Buckshot,
    Slug,
    Aim,
    M30Grenade,
    Flamethrower,
    Incinerator,
    FullAuto,
  ],
};

export default powerset;
