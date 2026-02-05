/**
 * Bane Spider Training Powerset
 * Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.
 *
 * Archetype: arachnos-soldier
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { BaneSpiderArmorUpgrade } from './bane-spider-armor-upgrade';
import { CloakingDevice } from './cloaking-device';
import { Surveillance } from './surveillance';
import { WebCocoon } from './web-cocoon';

export const powerset: Powerset = {
  id: 'arachnos-soldier/bane-spider-training',
  name: 'Bane Spider Training',
  description: 'Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.',
  icon: 'bane_spider_training_set.png',
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
