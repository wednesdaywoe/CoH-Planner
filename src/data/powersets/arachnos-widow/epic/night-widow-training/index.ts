/**
 * Night Widow Training Powerset
 * With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/night_widow_training
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './nw-mental-blast';
import { BuildUp as BuildUp } from './build-up';
import { SmokeGrenade as SmokeGrenade } from './nw-smoke-grenade';
import { Slash as Slash } from './nw-slash';
import { Eviscerate as Eviscerate } from './nw-eviscerate';
import { PsychicScream as PsychicScream } from './nw-psychic-scream';

export const powerset: Powerset = {
  id: 'arachnos-widow/night-widow-training',
  name: 'Night Widow Training',
  description: 'With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.',
  icon: 'night_widow_training_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    MentalBlast,
    BuildUp,
    SmokeGrenade,
    Slash,
    Eviscerate,
    PsychicScream,
  ],
};

export default powerset;
