/**
 * Stone Melee Powerset
 * You can use the powers of earth and stone to do battle with your foes. Stone Melee allows you to strike with fists of stone, summon earthen weapons, and even quake the very ground itself.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/stone_melee
 */

import type { Powerset } from '@/types';

import { StoneFist as StoneFist } from './stone-fist';
import { StoneMallet as StoneMallet } from './stone-mallet';
import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { Fault as Fault } from './fault';
import { Tremor as Tremor } from './tremor';
import { HurlBoulder as HurlBoulder } from './hurl-boulder';
import { SeismicSmash as SeismicSmash } from './seismic-smash';

export const powerset: Powerset = {
  id: 'tanker/stone-melee',
  name: 'Stone Melee',
  description: 'You can use the powers of earth and stone to do battle with your foes. Stone Melee allows you to strike with fists of stone, summon earthen weapons, and even quake the very ground itself.',
  icon: 'stone_melee_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    StoneFist,
    StoneMallet,
    HeavyMallet,
    Taunt,
    BuildUp,
    Fault,
    Tremor,
    HurlBoulder,
    SeismicSmash,
  ],
};

export default powerset;
