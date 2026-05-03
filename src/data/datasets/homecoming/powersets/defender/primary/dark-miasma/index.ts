/**
 * Dark Miasma Powerset
 * Focus the dark power of the Netherworld to weaken your foes. Dark Miasma focuses on draining your opponent.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/dark_miasma
 */

import type { Powerset } from '@/types';

import { TwilightGrasp as TwilightGrasp } from './twilight-grasp';
import { TarPatch as TarPatch } from './tar-patch';
import { DarkestNight as DarkestNight } from './darkest-night';
import { HowlingTwilight as HowlingTwilight } from './howling-twilight';
import { ShadowFall as ShadowFall } from './shadow-fall';
import { FearsomeStare as FearsomeStare } from './fearsome-stare';
import { PetrifyingGaze as PetrifyingGaze } from './petrifying-gaze';
import { BlackHole as BlackHole } from './black-hole';
import { DarkServant as DarkServant } from './chill-of-the-night';

export const powerset: Powerset = {
  id: 'defender/dark-miasma',
  name: 'Dark Miasma',
  description: 'Focus the dark power of the Netherworld to weaken your foes. Dark Miasma focuses on draining your opponent.',
  icon: 'dark_miasma_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    TwilightGrasp,
    TarPatch,
    DarkestNight,
    HowlingTwilight,
    ShadowFall,
    FearsomeStare,
    PetrifyingGaze,
    BlackHole,
    DarkServant,
  ],
};

export default powerset;
