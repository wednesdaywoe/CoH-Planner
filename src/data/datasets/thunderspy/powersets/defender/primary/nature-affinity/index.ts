/**
 * Nature Affinity Powerset
 * You have command over the forces of nature and are able to call forth primal energies to aid your allies and hinder your foes.  Many of your powers place a Bloom effect on you and your allies.  Each stack of Bloom boosts healing effects on the affected targets by a 4% for 30 seconds.  Bloom can stack up to 5 times.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/nature_affinity
 */

import type { Powerset } from '@/types';

import { Regrowth as Regrowth } from './regrowth';
import { CorrosiveSap as CorrosiveSap } from './corrosive-sap';
import { WildGrowth as WildGrowth } from './wild-growth';
import { SporeCloud as SporeCloud } from './spore-cloud';
import { LifegivingSpores as LifegivingSpores } from './lifegiving-spores';
import { LivingSpores as LivingSpores } from './living-spores';
import { WildBastion as WildBastion } from './wild-bastion';
import { RagingTempest as RagingTempest } from './raging-tempest';
import { Rebirth as Rebirth } from './rebirth';
import { Overgrowth as Overgrowth } from './overgrowth';

export const powerset: Powerset = {
  id: 'defender/nature-affinity',
  internalName: 'nature_affinity',
  name: 'Nature Affinity',
  description: 'You have command over the forces of nature and are able to call forth primal energies to aid your allies and hinder your foes.  Many of your powers place a Bloom effect on you and your allies.  Each stack of Bloom boosts healing effects on the affected targets by a 4% for 30 seconds.  Bloom can stack up to 5 times.',
  icon: 'nature_affinity_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    Regrowth,
    CorrosiveSap,
    WildGrowth,
    SporeCloud,
    LifegivingSpores,
    LivingSpores,
    WildBastion,
    RagingTempest,
    Rebirth,
    Overgrowth,
  ],
};

export default powerset;
