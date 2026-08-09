/**
 * Fortunata Training Powerset
 * Fortunata's have a wide array of extremely potent psychic attacks and controls.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/fortunata_training
 */

import type { Powerset } from '@/types';

import { FRTMentalBlast as FRTMentalBlast } from './frt-mental-blast';
import { FRTTelekineticBlast as FRTTelekineticBlast } from './frt-telekinetic-blast';
import { FRTSubdue as FRTSubdue } from './frt-subdue';
import { FRTAim as FRTAim } from './frt-aim';
import { FRTPsychicScream as FRTPsychicScream } from './frt-psychic-scream';
import { FRTDominate as FRTDominate } from './frt-dominate';
import { FRTPsionicLance as FRTPsionicLance } from './frt-psionic-lance';
import { FRTScrambleThoughts as FRTScrambleThoughts } from './frt-scramble-thoughts';
import { FRTTotalDomination as FRTTotalDomination } from './frt-total-domination';
import { FRTPsychicWail as FRTPsychicWail } from './frt-psychic-wail';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-training',
  internalName: 'fortunata_training',
  name: 'Fortunata Training',
  description: 'Fortunata\'s have a wide array of extremely potent psychic attacks and controls.',
  icon: 'fortunata_training_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    FRTMentalBlast,
    FRTTelekineticBlast,
    FRTSubdue,
    FRTAim,
    FRTPsychicScream,
    FRTDominate,
    FRTPsionicLance,
    FRTScrambleThoughts,
    FRTTotalDomination,
    FRTPsychicWail,
  ],
};

export default powerset;
