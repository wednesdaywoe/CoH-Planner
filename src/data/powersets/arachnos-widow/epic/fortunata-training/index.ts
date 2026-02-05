/**
 * Fortunata Training Powerset
 * Fortunata's have a wide array of extremely potent psychic attacks and controls.
 *
 * Archetype: arachnos-widow
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { MentalBlast } from './mental-blast';
import { TelekineticBlast } from './telekinetic-blast';
import { Subdue } from './subdue';
import { Aim } from './aim';
import { PsychicScream } from './psychic-scream';
import { Dominate } from './dominate';
import { PsionicTornado } from './psionic-tornado';
import { ScrambleThoughts } from './scramble-thoughts';
import { TotalDomination } from './total-domination';
import { PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-training',
  name: 'Fortunata Training',
  description: 'Fortunata\'s have a wide array of extremely potent psychic attacks and controls.',
  icon: 'fortunata_training_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    MentalBlast,
    TelekineticBlast,
    Subdue,
    Aim,
    PsychicScream,
    Dominate,
    PsionicTornado,
    ScrambleThoughts,
    TotalDomination,
    PsychicWail,
  ],
};

export default powerset;
