/**
 * Fortunata Training Powerset
 * Fortunata's have a wide array of extremely potent psychic attacks and controls.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/fortunata_training
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './frt-mental-blast';
import { TelekineticBlast as TelekineticBlast } from './frt-telekinetic-blast';
import { Subdue as Subdue } from './frt-subdue';
import { Aim as Aim } from './frt-aim';
import { PsychicScream as PsychicScream } from './frt-psychic-scream';
import { Dominate as Dominate } from './frt-dominate';
import { PsionicTornado as PsionicTornado } from './frt-psionic-lance';
import { ScrambleThoughts as ScrambleThoughts } from './frt-scramble-thoughts';
import { TotalDomination as TotalDomination } from './frt-total-domination';
import { PsychicWail as PsychicWail } from './frt-psychic-wail';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-training',
  name: 'Fortunata Training',
  description: 'Fortunata\'s have a wide array of extremely potent psychic attacks and controls.',
  icon: 'fortunata_training_set.ico',
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
