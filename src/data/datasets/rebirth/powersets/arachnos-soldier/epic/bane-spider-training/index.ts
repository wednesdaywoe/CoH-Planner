/**
 * Bane Spider Training Powerset
 * Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: training_gadgets/bane_spider_training
 */

import type { Powerset } from '@/types';

import { BaneSpiderArmor as BaneSpiderArmor } from './bane-spider-armor';
import { Hide as Hide } from './hide';
import { Surveillance as Surveillance } from './surveillance';
import { WebCocoon as WebCocoon } from './web-cocoon';

export const powerset: Powerset = {
  id: 'arachnos-soldier/bane-spider-training',
  setPath: 'Training_Gadgets.Bane_Spider_Training',
  name: 'Bane Spider Training',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 23,
  specializeRequires: ["Arachnos_Soldiers.Crab_Spider_Soldier","powerset?","Training_Gadgets.Crab_Spider_Training","Powerset?","||","!"],
  description: "Bane Spiders are the commandos of the Arachnos organization, providing excellent stealth and offensive capabilities.",
  icon: 'bane_spider_training_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    BaneSpiderArmor,
    Hide,
    Surveillance,
    WebCocoon,
  ],
};

export default powerset;
