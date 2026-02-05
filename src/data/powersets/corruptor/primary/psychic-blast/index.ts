/**
 * Psychic Blast Powerset
 * Blast enemies with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { MentalBlast as MentalBlast } from './mental-blast';
import { Subdue as Subdue } from './subdue';
import { TelekineticBlast as TelekineticBlast } from './telekinetic-blast';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { WillDomination as WillDomination } from './will-domination';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { ScrambleMinds as ScrambleMinds } from './scramble-minds';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'corruptor/psychic-blast',
  name: 'Psychic Blast',
  description: 'Blast enemies with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    MentalBlast,
    Subdue,
    TelekineticBlast,
    PsychicScream,
    WillDomination,
    PsionicLance,
    PsionicTornado,
    ScrambleMinds,
    PsychicWail,
  ],
};

export default powerset;
