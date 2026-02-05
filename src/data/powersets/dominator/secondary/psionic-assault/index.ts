/**
 * Psionic Assault Powerset
 * Blast your enemies with an array of offensive Psionic powers. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/psionic_assault
 */

import type { Powerset } from '@/types';

import { MindProbe as MindProbe } from './mind-probe';
import { PsionicDart as PsionicDart } from './psionic-dart';
import { TelekineticThrust as TelekineticThrust } from './telekinetic-thrust';
import { MentalBlast as MentalBlast } from './mental-blast';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { DrainPsyche as DrainPsyche } from './drain-psyche';
import { Subdue as Subdue } from './subdue';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsychicShockwave as PsychicShockwave } from './psychic-shockwave';

export const powerset: Powerset = {
  id: 'dominator/psionic-assault',
  name: 'Psionic Assault',
  description: 'Blast your enemies with an array of offensive Psionic powers. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.',
  icon: 'psionic_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    MindProbe,
    PsionicDart,
    TelekineticThrust,
    MentalBlast,
    PsychicScream,
    DrainPsyche,
    Subdue,
    PsionicLance,
    PsychicShockwave,
  ],
};

export default powerset;
