/**
 * Psychic Blast Powerset
 * Blast enemies with an array of offensive, long range Psionic powers. While few living beings can resist their effects,  Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './mental-blast';
import { Subdue as Subdue } from './subdue';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { WillDomination as WillDomination } from './will-domination';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { ScrambleThoughts as ScrambleThoughts } from './scramble-thoughts';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'corruptor/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast enemies with an array of offensive, long range Psionic powers. While few living beings can resist their effects,  Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    MentalBlast,
    Subdue,
    PsionicLance,
    PsychicScream,
    TelekineticBlast,
    WillDomination,
    PsionicTornado,
    ScrambleThoughts,
    PsychicWail,
  ],
};

export default powerset;
