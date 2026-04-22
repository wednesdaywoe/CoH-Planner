/**
 * Nature Affinity Powerset
 * You have command over the forces of nature and are able to call forth primal energies to aid your allies and hinder your foes. Many of your powers place a Bloom effect on you and your allies. Each stack of Bloom boosts healing effects on the affected targets by a 4% for 30 seconds. Bloom can stack up to 5 times.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/nature_affinity
 */

import type { Powerset } from '@/types';

import { CorrosiveEnzymes as CorrosiveEnzymes } from './corrosive-sap';
import { LifegivingSpores as LifegivingSpores } from './lifegiving-spores';
import { Overgrowth as Overgrowth } from './overgrowth';
import { EntanglingAura as EntanglingAura } from './raging-tempest';
import { Rebirth as Rebirth } from './rebirth';
import { Regrowth as Regrowth } from './regrowth';
import { SporeCloud as SporeCloud } from './spore-cloud';
import { WildBastion as WildBastion } from './wild-bastion';
import { WildGrowth as WildGrowth } from './wild-growth';

export const powerset: Powerset = {
  id: 'mastermind/nature-affinity',
  name: 'Nature Affinity',
  description: 'You have command over the forces of nature and are able to call forth primal energies to aid your allies and hinder your foes. Many of your powers place a Bloom effect on you and your allies. Each stack of Bloom boosts healing effects on the affected targets by a 4% for 30 seconds. Bloom can stack up to 5 times.',
  icon: 'nature_affinity_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    CorrosiveEnzymes,
    LifegivingSpores,
    Overgrowth,
    EntanglingAura,
    Rebirth,
    Regrowth,
    SporeCloud,
    WildBastion,
    WildGrowth,
  ],
};

export default powerset;
