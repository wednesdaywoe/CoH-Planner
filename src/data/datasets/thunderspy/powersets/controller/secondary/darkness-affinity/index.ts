/**
 * Darkness Affinity Powerset
 * P2881268957
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/darkness_affinity
 */

import type { Powerset } from '@/types';

import { TwilightGrasp as TwilightGrasp } from './twilight-grasp';
import { TarPatch as TarPatch } from './tar-patch';
import { DarkestNight as DarkestNight } from './darkest-night';
import { Chillofthenight as Chillofthenight } from './chill-of-the-night';
import { HowlingTwilight as HowlingTwilight } from './howling-twilight';
import { ShadowFall as ShadowFall } from './shadow-fall';
import { Fade as Fade } from './fade';
import { SoulAbsorption as SoulAbsorption } from './soul-absorption';
import { BlackHole as BlackHole } from './black-hole';
import { DarkServant as DarkServant } from './dark-servant';

export const powerset: Powerset = {
  id: 'controller/darkness-affinity',
  setPath: 'Controller_Buff.Darkness_Affinity',
  name: 'Darkness Affinity',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'P2881268957',
  icon: 'darkness_affinity_set.ico',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    TwilightGrasp,
    TarPatch,
    DarkestNight,
    Chillofthenight,
    HowlingTwilight,
    ShadowFall,
    Fade,
    SoulAbsorption,
    BlackHole,
    DarkServant,
  ],
};

export default powerset;
