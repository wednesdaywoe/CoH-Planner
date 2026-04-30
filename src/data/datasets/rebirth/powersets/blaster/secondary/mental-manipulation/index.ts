/**
 * Mental Manipulation Powerset
 * Manipulate your enemies with an array of offensive Psionic powers. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/mental_manipulation
 */

import type { Powerset } from '@/types';

import { Subdual as Subdual } from './subdual';
import { MindProbe as MindProbe } from './mind-probe';
import { TelekineticThrust as TelekineticThrust } from './telekinetic-thrust';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { Concentration as Concentration } from './build-up';
import { DrainPsyche as DrainPsyche } from './drain-psyche';
import { WorldofConfusion as WorldofConfusion } from './world-of-confusion';
import { Scare as Scare } from './scare';
import { PsychicShockwave as PsychicShockwave } from './psychic-shockwave';

export const powerset: Powerset = {
  id: 'blaster/mental-manipulation',
  name: 'Mental Manipulation',
  description: 'Manipulate your enemies with an array of offensive Psionic powers. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.',
  icon: 'mental_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    Subdual,
    MindProbe,
    TelekineticThrust,
    PsychicScream,
    Concentration,
    DrainPsyche,
    WorldofConfusion,
    Scare,
    PsychicShockwave,
  ],
};

export default powerset;
