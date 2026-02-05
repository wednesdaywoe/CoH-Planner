/**
 * Night Widow Training Powerset
 * With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.
 *
 * Archetype: arachnos-widow
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { MentalBlast } from './mental-blast';
import { BuildUp } from './build-up';
import { SmokeGrenade } from './smoke-grenade';
import { Slash } from './slash';
import { Eviscerate } from './eviscerate';
import { PsychicScream } from './psychic-scream';

export const powerset: Powerset = {
  id: 'arachnos-widow/night-widow-training',
  name: 'Night Widow Training',
  description: 'With powers of Stealth, and heightened combat skills, coupled with strong mental attacks, the Night Widows of Arachnos are extremely dangerous.',
  icon: 'night_widow_training_set.png',
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
