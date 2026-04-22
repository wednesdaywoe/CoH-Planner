/**
 * Fiery Assault Powerset
 * Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/fiery_assault
 */

import type { Powerset } from '@/types';

import { Blaze as Blaze } from './blaze';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { Combustion as Combustion } from './combustion';
import { Consume as Consume } from './consume';
import { EmbraceofFire as EmbraceofFire } from './fiery-embrace';
import { FireBlast as FireBlast } from './fire-blast';
import { FireBreath as FireBreath } from './fire-breath';
import { Flares as Flares } from './flares';
import { Incinerate as Incinerate } from './incinerate';

export const powerset: Powerset = {
  id: 'dominator/fiery-assault',
  name: 'Fiery Assault',
  description: 'Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Blaze,
    BlazingBolt,
    Combustion,
    Consume,
    EmbraceofFire,
    FireBlast,
    FireBreath,
    Flares,
    Incinerate,
  ],
};

export default powerset;
