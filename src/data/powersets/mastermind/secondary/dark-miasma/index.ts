/**
 * Dark Miasma Powerset
 * Focus the dark power of the Netherworld to weaken your foes. Dark Miasma focuses on draining your opponent.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/dark_miasma
 */

import type { Powerset } from '@/types';

import { BlackHole as BlackHole } from './black-hole';
import { DarkServant as DarkServant } from './dark-servant';
import { DarkestNight as DarkestNight } from './darkest-night';
import { FearsomeStare as FearsomeStare } from './fearsome-stare';
import { HowlingTwilight as HowlingTwilight } from './howling-twilight';
import { PetrifyingGaze as PetrifyingGaze } from './petrifying-gaze';
import { ShadowFall as ShadowFall } from './shadow-fall';
import { TarPatch as TarPatch } from './tar-patch';
import { TwilightGrasp as TwilightGrasp } from './twilight-grasp';

export const powerset: Powerset = {
  id: 'mastermind/dark-miasma',
  name: 'Dark Miasma',
  description: 'Focus the dark power of the Netherworld to weaken your foes. Dark Miasma focuses on draining your opponent.',
  icon: 'dark_miasma_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    BlackHole,
    DarkServant,
    DarkestNight,
    FearsomeStare,
    HowlingTwilight,
    PetrifyingGaze,
    ShadowFall,
    TarPatch,
    TwilightGrasp,
  ],
};

export default powerset;
