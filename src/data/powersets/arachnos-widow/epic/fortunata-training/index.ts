/**
 * Fortunata Training Powerset
 * Fortunata's have a wide array of extremely potent psychic attacks and controls.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/fortunata_training
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './frt-aim';
import { Dominate as Dominate } from './frt-dominate';
import { MentalBlast as MentalBlast } from './frt-mental-blast';
import { PsionicTornado as PsionicTornado } from './frt-psionic-lance';
import { PsychicScream as PsychicScream } from './frt-psychic-scream';
import { PsychicWail as PsychicWail } from './frt-psychic-wail';
import { ScrambleThoughts as ScrambleThoughts } from './frt-scramble-thoughts';
import { Subdue as Subdue } from './frt-subdue';
import { TelekineticBlast as TelekineticBlast } from './frt-telekinetic-blast';
import { TotalDomination as TotalDomination } from './frt-total-domination';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-training',
  name: 'Fortunata Training',
  description: 'Fortunata\'s have a wide array of extremely potent psychic attacks and controls.',
  icon: 'fortunata_training_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    Aim,
    Dominate,
    MentalBlast,
    PsionicTornado,
    PsychicScream,
    PsychicWail,
    ScrambleThoughts,
    Subdue,
    TelekineticBlast,
    TotalDomination,
  ],
};

export default powerset;
