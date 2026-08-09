/**
 * Hard Life Powerset
 * Wield the trusty power of the shotgun. Combine your shots to cripple your foes! Most attacks are targetless cones.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/hobo_melee
 */

import type { Powerset } from '@/types';

import { Slug as Slug } from './slug';
import { SuckerPunch as SuckerPunch } from './sucker-punch';
import { Buckshot as Buckshot } from './buckshot';
import { Birdshot as Birdshot } from './birdshot';
import { HardLife as HardLife } from './hard-life';
import { DragonBreath as DragonBreath } from './dragon-breath';
import { Snakeshot as Snakeshot } from './snakeshot';
import { PointBlank as PointBlank } from './point-blank';
import { Grenade as Grenade } from './grenade';

export const powerset: Powerset = {
  id: 'tanker/hard-life',
  internalName: 'hobo_melee',
  name: 'Hard Life',
  description: 'Wield the trusty power of the shotgun. Combine your shots to cripple your foes! Most attacks are targetless cones.',
  icon: 'battle_axe_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Slug,
    SuckerPunch,
    Buckshot,
    Birdshot,
    HardLife,
    DragonBreath,
    Snakeshot,
    PointBlank,
    Grenade,
  ],
};

export default powerset;
