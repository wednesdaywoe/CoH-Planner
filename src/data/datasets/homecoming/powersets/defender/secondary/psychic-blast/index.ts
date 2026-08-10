/**
 * Psychic Blast Powerset
 * Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/psychic_blast
 */

import type { Powerset } from '@/types';

import { Subdue as Subdue } from './subdue';
import { MentalBlast as MentalBlast } from './mental-blast';
import { Telekineticblast as Telekineticblast } from './telekinetic-blast';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { WillDomination as WillDomination } from './will-domination';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsionicTornado as PsionicTornado } from './psionic-tornado';
import { ScrambleThoughts as ScrambleThoughts } from './scramble-thoughts';
import { PsychicWail as PsychicWail } from './psychic-wail';

export const powerset: Powerset = {
  id: 'defender/psychic-blast',
  setPath: 'Defender_Ranged.Psychic_Blast',
  name: 'Psychic Blast',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Blast villains with an array of offensive, long range Psionic powers. While few living beings can resist their effects, Creatures without minds, like machines and robots, are not affected as strongly.',
  icon: 'psychic_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Subdue,
    MentalBlast,
    Telekineticblast,
    PsychicScream,
    WillDomination,
    PsionicLance,
    PsionicTornado,
    ScrambleThoughts,
    PsychicWail,
  ],
};

export default powerset;
