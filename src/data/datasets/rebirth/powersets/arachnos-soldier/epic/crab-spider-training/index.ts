/**
 * Crab Spider Training Powerset
 * Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: training_gadgets/crab_spider_training
 */

import type { Powerset } from '@/types';

import { CrabSpiderArmorUpgrade as CrabSpiderArmorUpgrade } from './crab-spider-armor';
import { Fortification as Fortification } from './fortification';
import { Serum as Serum } from './serum';
import { SummonSpiderlings as SummonSpiderlings } from './summon-spiderlings';

export const powerset: Powerset = {
  id: 'arachnos-soldier/crab-spider-training',
  name: 'Crab Spider Training',
  description: 'Crab Spiders are heavy infantry in the Arachnos Organization, with a wide array of ranged and melee combat skills.',
  icon: 'crab_spider_training_set.ico',
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
