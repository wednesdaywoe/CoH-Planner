/**
 * Bane Spider Training Powerset
 * Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: training_gadgets/bane_spider_training
 */

import type { Powerset } from '@/types';

import { BaneSpiderArmorUpgrade as BaneSpiderArmorUpgrade } from './bane-spider-armor';
import { CloakingDevice as CloakingDevice } from './hide';
import { Surveillance as Surveillance } from './surveillance';
import { WebCocoon as WebCocoon } from './web-cocoon';

export const powerset: Powerset = {
  id: 'arachnos-soldier/bane-spider-training',
  name: 'Bane Spider Training',
  description: 'Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.',
  icon: 'bane_spider_training_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    BaneSpiderArmorUpgrade,
    CloakingDevice,
    Surveillance,
    WebCocoon,
  ],
};

export default powerset;
