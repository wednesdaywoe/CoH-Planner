/**
 * Mercenaries Powerset
 * Despite their reputations, Mercenaries are extremely loyal and dedicated soldiers.  They are the best at what they do, and they always follow orders, exactly what a Mastermind needs.  Mercenaries typically use conventional weapons and all Mercenaries have body armor that gives them resistance to smashing and lethal damage and their training makes them resistant to Confusion and Placate
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/mercenaries
 */

import type { Powerset } from '@/types';

import { Burst as Burst } from './burst';
import { Soldiers as Soldiers } from './soldiers';
import { Ungarmax as Ungarmax } from './ungarmax';
import { Attrition as Attrition } from './attrition';
import { Slug as Slug } from './slug';
import { CommandingPresence as CommandingPresence } from './commanding-presence';
import { M30Grenade as M30Grenade } from './m30-grenade';
import { SpecOps as SpecOps } from './spec-ops';
import { Serum as Serum } from './serum';
import { Commando as Commando } from './commando';
import { CommandandConquer as CommandandConquer } from './command-and-conquer';

export const powerset: Powerset = {
  id: 'mastermind/mercenaries',
  name: 'Mercenaries',
  description: 'Despite their reputations, Mercenaries are extremely loyal and dedicated soldiers.  They are the best at what they do, and they always follow orders, exactly what a Mastermind needs.  Mercenaries typically use conventional weapons and all Mercenaries have body armor that gives them resistance to smashing and lethal damage and their training makes them resistant to Confusion and Placate',
  icon: 'mercenaries_set.ico',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    Burst,
    Soldiers,
    Ungarmax,
    Attrition,
    Slug,
    CommandingPresence,
    M30Grenade,
    SpecOps,
    Serum,
    Commando,
    CommandandConquer,
  ],
};

export default powerset;
