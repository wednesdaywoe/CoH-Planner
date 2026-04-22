/**
 * Ninjitsu Powerset
 * Ninjitsu is the secret art of Ninja. Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight. Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/ninjitsu
 */

import type { Powerset } from '@/types';

import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { Caltrops as Caltrops } from './caltrops';
import { DangerSense as DangerSense } from './danger-sense';
import { Hide as Hide } from './hide';
import { KujiInRetsu as KujiInRetsu } from './kuji-in-retsu';
import { KujiInRin as KujiInRin } from './kuji-in-rin';
import { KujiInSha as KujiInSha } from './kuji-in-sha';
import { NinjaReflexes as NinjaReflexes } from './ninja-reflexes';
import { SmokeFlash as SmokeFlash } from './smoke-flash';

export const powerset: Powerset = {
  id: 'stalker/ninjitsu',
  name: 'Ninjitsu',
  description: 'Ninjitsu is the secret art of Ninja. Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight. Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.',
  icon: 'ninjitsu_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    BlindingPowder,
    Caltrops,
    DangerSense,
    Hide,
    KujiInRetsu,
    KujiInRin,
    KujiInSha,
    NinjaReflexes,
    SmokeFlash,
  ],
};

export default powerset;
