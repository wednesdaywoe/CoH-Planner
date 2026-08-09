/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects,  Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { PsionicDart as PsionicDart } from './psionic-dart';
import { MentalBlast as MentalBlast } from './mental-blast';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { WillDomination as WillDomination } from './will-domination';
import { ScrambleThoughts as ScrambleThoughts } from './scramble-thoughts';
import { Aim as Aim } from './aim';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'blaster/psychic-blast',
  internalName: 'psychic_blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects,  Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    PsionicDart,
    MentalBlast,
    PsionicTornado,
    TelekineticBlast,
    WillDomination,
    ScrambleThoughts,
    Aim,
    PsionicLance,
    PsychicWail,
  ],
};

export default powerset;
