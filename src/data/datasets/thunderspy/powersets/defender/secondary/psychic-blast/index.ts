/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects,  Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './mental-blast';
import { Subdue as Subdue } from './subdue';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { Telekineticblast as Telekineticblast } from './telekinetic-blast';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { WillDomination as WillDomination } from './will-domination';
import { ScrambleThoughts as ScrambleThoughts } from './scramble-thoughts';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'defender/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects,  Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    MentalBlast,
    Subdue,
    PsychicScream,
    Telekineticblast,
    PsionicTornado,
    WillDomination,
    ScrambleThoughts,
    PsionicLance,
    PsychicWail,
  ],
};

export default powerset;
