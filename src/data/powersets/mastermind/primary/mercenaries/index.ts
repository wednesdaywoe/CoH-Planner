/**
 * Mercenaries Powerset
 * Despite their reputations, Mercenaries are extremely loyal and dedicated soldiers. They are the best at what they do, and they always follow orders, exactly what a Mastermind needs. Mercenaries typically use conventional weapons and all Mercenaries have body armor that gives them resistance to smashing and lethal damage and their training makes them resistant to Confusion and Placate
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/mercenaries
 */

import type { Powerset } from '@/types';

import { Burst as Burst } from './burst';
import { Commando as Commando } from './commando';
import { EquipMercenary as EquipMercenary } from './equip-mercenary';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { Serum as Serum } from './serum';
import { Slug as Slug } from './slug';
import { Soldiers as Soldiers } from './soldiers';
import { SpecOps as SpecOps } from './spec-ops';
import { TacticalUpgrade as TacticalUpgrade } from './tactical-upgrade';

export const powerset: Powerset = {
  id: 'mastermind/mercenaries',
  name: 'Mercenaries',
  description: 'Despite their reputations, Mercenaries are extremely loyal and dedicated soldiers. They are the best at what they do, and they always follow orders, exactly what a Mastermind needs. Mercenaries typically use conventional weapons and all Mercenaries have body armor that gives them resistance to smashing and lethal damage and their training makes them resistant to Confusion and Placate',
  icon: 'mercenaries_set.ico',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    Burst,
    Commando,
    EquipMercenary,
    M30Grenade,
    Serum,
    Slug,
    Soldiers,
    SpecOps,
    TacticalUpgrade,
  ],
};

export default powerset;
