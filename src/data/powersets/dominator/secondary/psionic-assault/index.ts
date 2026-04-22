/**
 * Psionic Assault Powerset
 * Blast your enemies with an array of offensive Psionic powers. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/psionic_assault
 */

import type { Powerset } from '@/types';

import { DrainPsyche as DrainPsyche } from './drain-psyche';
import { MentalBlast as MentalBlast } from './mental-blast';
import { MindProbe as MindProbe } from './mind-probe';
import { PsionicDart as PsionicDart } from './psionic-dart';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { PsychicShockwave as PsychicShockwave } from './psychic-shockwave';
import { Subdue as Subdue } from './subdue';
import { TelekineticThrust as TelekineticThrust } from './telekinetic-thrust';

export const powerset: Powerset = {
  id: 'dominator/psionic-assault',
  name: 'Psionic Assault',
  description: 'Blast your enemies with an array of offensive Psionic powers. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.',
  icon: 'psionic_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    DrainPsyche,
    MentalBlast,
    MindProbe,
    PsionicDart,
    PsionicLance,
    PsychicScream,
    PsychicShockwave,
    Subdue,
    TelekineticThrust,
  ],
};

export default powerset;
