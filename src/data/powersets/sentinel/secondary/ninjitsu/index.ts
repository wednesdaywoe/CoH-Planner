/**
 * Ninjitsu Powerset
 * Ninjitsu is the secret art of Ninja. Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight. Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/ninjitsu
 */

import type { Powerset } from '@/types';

import { BlindingPowder as BlindingPowder } from './blinding-powder';
import { BoRyaku as BoRyaku } from './bo-ryaku';
import { DangerSense as DangerSense } from './danger-sense';
import { KujiInRetsu as KujiInRetsu } from './kuji-in-retsu';
import { KujiInRin as KujiInRin } from './kuji-in-rin';
import { KujiInSha as KujiInSha } from './kuji-in-sha';
import { NinjaReflexes as NinjaReflexes } from './ninja-reflexes';
import { SeishintekiKyoyo as SeishintekiKyoyo } from './seishinteki-kyoyo';
import { ShinobiIri as ShinobiIri } from './shinobi-iri';

export const powerset: Powerset = {
  id: 'sentinel/ninjitsu',
  name: 'Ninjitsu',
  description: 'Ninjitsu is the secret art of Ninja. Many Ninjitsu powers emphasize acute senses that allow you to react deftly to avoid danger. Others focus on the ability to hide in plain sight. Still others rely on the ancient art of Kuji Kiri, and the pure focus of the mind to accomplish the impossible.',
  icon: 'ninjitsu_set.ico',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    BlindingPowder,
    BoRyaku,
    DangerSense,
    KujiInRetsu,
    KujiInRin,
    KujiInSha,
    NinjaReflexes,
    SeishintekiKyoyo,
    ShinobiIri,
  ],
};

export default powerset;
