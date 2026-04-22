/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { PsychicFocus as PsychicFocus } from './aim';
import { MentalBlast as MentalBlast } from './mental-blast';
import { PsionicDarts as PsionicDarts } from './psionic-dart';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { PsychicWail as PsychicWail } from './psychic-wail';
import { ScrambleMinds as ScrambleMinds } from './scramble-thoughts';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { DominateWill as DominateWill } from './will-domination';

export const powerset: Powerset = {
  id: 'blaster/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    PsychicFocus,
    MentalBlast,
    PsionicDarts,
    PsionicLance,
    PsionicTornado,
    PsychicWail,
    ScrambleMinds,
    TelekineticBlast,
    DominateWill,
  ],
};

export default powerset;
