/**
 * Ninjitsu Powerset
 * Ninjitsu is the secret art of Ninja. Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight. Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/ninjitsu
 */

import type { Powerset } from '@/types';

import { DangerSense as DangerSense } from './danger-sense';
import { NinjaReflexes as NinjaReflexes } from './ninja-reflexes';
import { ShinobiIri as ShinobiIri } from './shinobi-iri';
import { KujiInRin as KujiInRin } from './kuji-in-rin';
import { SeishintekiKyoyo as SeishintekiKyoyo } from './seishinteki-kyoyo';
import { KujiInSha as KujiInSha } from './kuji-in-sha';
import { BoRyaku as BoRyaku } from './bo-ryaku';
import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { KujiInRetsu as KujiInRetsu } from './kuji-in-retsu';

export const powerset: Powerset = {
  id: 'sentinel/ninjitsu',
  name: 'Ninjitsu',
  description: 'Ninjitsu is the secret art of Ninja. Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight. Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.',
  icon: 'ninjitsu_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    DangerSense,
    NinjaReflexes,
    ShinobiIri,
    KujiInRin,
    SeishintekiKyoyo,
    KujiInSha,
    BoRyaku,
    BlindingPowder,
    KujiInRetsu,
  ],
};

export default powerset;
