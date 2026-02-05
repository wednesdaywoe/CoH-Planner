/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './mental-blast';
import { DominateWill as DominateWill } from './dominate-will';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { PsionicDarts as PsionicDarts } from './psionic-darts';
import { PsychicFocus as PsychicFocus } from './psychic-focus';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { ScrambleMinds as ScrambleMinds } from './scramble-minds';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'blaster/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.png',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    MentalBlast,
    DominateWill,
    TelekineticBlast,
    PsionicDarts,
    PsychicFocus,
    PsionicLance,
    PsionicTornado,
    ScrambleMinds,
    PsychicWail,
  ],
};

export default powerset;
