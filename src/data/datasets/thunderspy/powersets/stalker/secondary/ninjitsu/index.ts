/**
 * Ninjitsu Powerset
 * Ninjitsu is the secret art of Ninja.  Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight.  Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/ninjitsu
 */

import type { Powerset } from '@/types';

import { NinjaReflexes as NinjaReflexes } from './ninja-reflexes';
import { DangerSense as DangerSense } from './danger-sense';
import { KujiInSha as KujiInSha } from './kuji-in-sha';
import { KujiInRin as KujiInRin } from './kuji-in-rin';
import { Caltrops as Caltrops } from './caltrops';
import { SmokeFlash as SmokeFlash } from './smoke-flash';
import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { Hide as Hide } from './hide';
import { KujiInRetsu as KujiInRetsu } from './kuji-in-retsu';

export const powerset: Powerset = {
  id: 'stalker/ninjitsu',
  setPath: 'Stalker_Defense.Ninjitsu',
  name: 'Ninjitsu',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Ninjitsu is the secret art of Ninja.  Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight.  Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.",
  icon: 'ninjitsu_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    NinjaReflexes,
    DangerSense,
    KujiInSha,
    KujiInRin,
    Caltrops,
    SmokeFlash,
    BlindingPowder,
    Hide,
    KujiInRetsu,
  ],
};

export default powerset;
