/**
 * Crab Spider Training Powerset
 * Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.
 *
 * Archetype: arachnos-soldier
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { CrabSpiderArmorUpgrade } from './crab-spider-armor-upgrade';
import { Fortification } from './fortification';
import { Serum } from './serum';
import { SummonSpiderlings } from './summon-spiderlings';

export const powerset: Powerset = {
  id: 'arachnos-soldier/crab-spider-training',
  name: 'Crab Spider Training',
  description: 'Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.',
  icon: 'crab_spider_training_set.png',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    CrabSpiderArmorUpgrade,
    Fortification,
    Serum,
    SummonSpiderlings,
  ],
};

export default powerset;
