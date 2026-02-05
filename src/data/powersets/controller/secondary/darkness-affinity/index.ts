/**
 * Darkness Affinity Powerset
 * Focus the dark power of the Netherworld to weaken your foes and aid your allies. Darkness Affinity focuses on draining your opponent.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/darkness_affinity
 */

import type { Powerset } from '@/types';

import { TarPatch as TarPatch } from './tar-patch';
import { TwilightGrasp as TwilightGrasp } from './twilight-grasp';
import { DarkestNight as DarkestNight } from './darkest-night';
import { HowlingTwilight as HowlingTwilight } from './howling-twilight';
import { ShadowFall as ShadowFall } from './shadow-fall';
import { Fade as Fade } from './fade';
import { SoulAbsorption as SoulAbsorption } from './soul-absorption';
import { BlackHole as BlackHole } from './black-hole';
import { DarkServant as DarkServant } from './dark-servant';

export const powerset: Powerset = {
  id: 'controller/darkness-affinity',
  name: 'Darkness Affinity',
  description: 'Focus the dark power of the Netherworld to weaken your foes and aid your allies. Darkness Affinity focuses on draining your opponent.',
  icon: 'darkness_affinity_set.png',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    TarPatch,
    TwilightGrasp,
    DarkestNight,
    HowlingTwilight,
    ShadowFall,
    Fade,
    SoulAbsorption,
    BlackHole,
    DarkServant,
  ],
};

export default powerset;
