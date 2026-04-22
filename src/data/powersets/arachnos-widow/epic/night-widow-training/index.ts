/**
 * Night Widow Training Powerset
 * With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/night_widow_training
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { Eviscerate as Eviscerate } from './nw-eviscerate';
import { MentalBlast as MentalBlast } from './nw-mental-blast';
import { PsychicScream as PsychicScream } from './nw-psychic-scream';
import { Slash as Slash } from './nw-slash';
import { SmokeGrenade as SmokeGrenade } from './nw-smoke-grenade';

export const powerset: Powerset = {
  id: 'arachnos-widow/night-widow-training',
  name: 'Night Widow Training',
  description: 'With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.',
  icon: 'night_widow_training_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    BuildUp,
    Eviscerate,
    MentalBlast,
    PsychicScream,
    Slash,
    SmokeGrenade,
  ],
};

export default powerset;
