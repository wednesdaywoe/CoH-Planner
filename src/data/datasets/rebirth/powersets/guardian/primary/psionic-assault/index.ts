/**
 * Psionic Assault Powerset
 * Blast your enemies with an array of offensive psionic powers. Your psionic damaging attacks have a chance to grant you Insight into your enemies. While you have Insight, your psionic damage powers cause additional psionic damage over time. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/psionic_assault
 */

import type { Powerset } from '@/types';

import { PsionicDart as PsionicDart } from './psionic-dart';
import { TelekineticBlow as TelekineticBlow } from './telekinetic-blow';
import { MentalBlast as MentalBlast } from './mental-blast';
import { PsychicScream as PsychicScream } from './psychic-scream';
import { Concentration as Concentration } from './concentration';
import { MindProbe as MindProbe } from './mind-probe';
import { Subdue as Subdue } from './subdue';
import { PsionicLance as PsionicLance } from './psionic-lance';
import { PsychicShockwave as PsychicShockwave } from './psychic-shockwave';

export const powerset: Powerset = {
  id: 'guardian/psionic-assault',
  name: 'Psionic Assault',
  description: 'Blast your enemies with an array of offensive psionic powers. Your psionic damaging attacks have a chance to grant you Insight into your enemies. While you have Insight, your psionic damage powers cause additional psionic damage over time. Few living beings can resist their effects. Creatures without minds, however, like machines and robots, are much more resistant.',
  icon: 'psionic_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    PsionicDart,
    TelekineticBlow,
    MentalBlast,
    PsychicScream,
    Concentration,
    MindProbe,
    Subdue,
    PsionicLance,
    PsychicShockwave,
  ],
};

export default powerset;
