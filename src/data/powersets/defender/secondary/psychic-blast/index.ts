/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './mental-blast';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { PsychicWail as PsychicWail } from './psychic-wail';
import { ScrambleMinds as ScrambleMinds } from './scramble-thoughts';
import { Subdue as Subdue } from './subdue';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { WillDomination as WillDomination } from './will-domination';

export const powerset: Powerset = {
  id: 'defender/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    MentalBlast,
    PsionicLance,
    PsionicTornado,
    PsychicScream,
    PsychicWail,
    ScrambleMinds,
    Subdue,
    TelekineticBlast,
    WillDomination,
  ],
};

export default powerset;
