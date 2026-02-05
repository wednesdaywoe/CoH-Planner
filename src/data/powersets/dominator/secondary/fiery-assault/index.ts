/**
 * Fiery Assault Powerset
 * Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/fiery_assault
 */

import type { Powerset } from '@/types';

import { Flares as Flares } from './flares';
import { Incinerate as Incinerate } from './incinerate';
import { FireBreath as FireBreath } from './fire-breath';
import { FireBlast as FireBlast } from './fire-blast';
import { EmbraceofFire as EmbraceofFire } from './embrace-of-fire';
import { Combustion as Combustion } from './combustion';
import { Consume as Consume } from './consume';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { Blaze as Blaze } from './blaze';

export const powerset: Powerset = {
  id: 'dominator/fiery-assault',
  name: 'Fiery Assault',
  description: 'Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Flares,
    Incinerate,
    FireBreath,
    FireBlast,
    EmbraceofFire,
    Combustion,
    Consume,
    BlazingBolt,
    Blaze,
  ],
};

export default powerset;
