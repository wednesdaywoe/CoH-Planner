/**
 * Nature Affinity Powerset
 * You have command over the forces of nature and are able to call forth primal energies to aid your allies and hinder your foes. Many of your powers place a Bloom effect on you and your allies. Each stack of Bloom boosts healing effects on the affected targets by a 4% for 30 seconds. Bloom can stack up to 5 times.
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/nature_affinity
 */

import type { Powerset } from '@/types';

import { CorrosiveEnzymes as CorrosiveEnzymes } from './corrosive-enzymes';
import { Regrowth as Regrowth } from './regrowth';
import { WildGrowth as WildGrowth } from './wild-growth';
import { SporeCloud as SporeCloud } from './spore-cloud';
import { LifegivingSpores as LifegivingSpores } from './lifegiving-spores';
import { WildBastion as WildBastion } from './wild-bastion';
import { Rebirth as Rebirth } from './rebirth';
import { EntanglingAura as EntanglingAura } from './entangling-aura';
import { Overgrowth as Overgrowth } from './overgrowth';

export const powerset: Powerset = {
  id: 'corruptor/nature-affinity',
  name: 'Nature Affinity',
  description: 'You have command over the forces of nature and are able to call forth primal energies to aid your allies and hinder your foes. Many of your powers place a Bloom effect on you and your allies. Each stack of Bloom boosts healing effects on the affected targets by a 4% for 30 seconds. Bloom can stack up to 5 times.',
  icon: 'nature_affinity_set.png',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    CorrosiveEnzymes,
    Regrowth,
    WildGrowth,
    SporeCloud,
    LifegivingSpores,
    WildBastion,
    Rebirth,
    EntanglingAura,
    Overgrowth,
  ],
};

export default powerset;
