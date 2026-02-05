/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './mental-blast';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { WillDomination as WillDomination } from './will-domination';
import { PsychicFocus as PsychicFocus } from './psychic-focus';
import { PsionicStrike as PsionicStrike } from './psionic-strike';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { ScrambleThoughts as ScrambleThoughts } from './scramble-thoughts';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'sentinel/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    MentalBlast,
    TelekineticBlast,
    PsychicScream,
    WillDomination,
    PsychicFocus,
    PsionicStrike,
    PsionicTornado,
    ScrambleThoughts,
    PsychicWail,
  ],
};

export default powerset;
