/**
 * Fiery Assault Powerset
 * Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/fiery_assault
 */

import type { Powerset } from '@/types';

import { Flares as Flares } from './flares';
import { Cremate as Cremate } from './cremate';
import { FireBreath as FireBreath } from './fire-breath';
import { FireBlast as FireBlast } from './fire-blast';
import { BuildUp as BuildUp } from './build-up';
import { Combustion as Combustion } from './combustion';
import { Incinerate as Incinerate } from './incinerate';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { Blaze as Blaze } from './blaze';

export const powerset: Powerset = {
  id: 'guardian/fiery-assault',
  name: 'Fiery Assault',
  description: 'Fiery Assault allows you to conjure up flaming melee attacks and hurl devastating fiery projectiles. Fiery Assault powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    Flares,
    Cremate,
    FireBreath,
    FireBlast,
    BuildUp,
    Combustion,
    Incinerate,
    BlazingBolt,
    Blaze,
  ],
};

export default powerset;
