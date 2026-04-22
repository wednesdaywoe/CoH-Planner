/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { PsychicFocus as PsychicFocus } from './aim';
import { MentalBlast as MentalBlast } from './mental-blast';
import { PsionicStrike as PsionicStrike } from './psionic-strike';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { PsychicWail as PsychicWail } from './psychic-wail';
import { ScrambleThoughts as ScrambleThoughts } from './scramble-thoughts';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { WillDomination as WillDomination } from './will-domination';

export const powerset: Powerset = {
  id: 'sentinel/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    PsychicFocus,
    MentalBlast,
    PsionicStrike,
    PsionicTornado,
    PsychicScream,
    PsychicWail,
    ScrambleThoughts,
    TelekineticBlast,
    WillDomination,
  ],
};

export default powerset;
