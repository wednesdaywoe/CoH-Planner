/**
 * Stone Melee Powerset
 * You can use the powers of earth and stone to do battle with your foes. Stone Melee allows you to strike with fists of stone, summon earthen weapons, and even quake the very ground itself.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/stone_melee
 */

import type { Powerset } from '@/types';

import { StoneFist as StoneFist } from './stone-fist';
import { StoneMallet as StoneMallet } from './stone-mallet';
import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { BuildUp as BuildUp } from './build-up';
import { Fault as Fault } from './fault';
import { Taunt as Taunt } from './taunt';
import { SeismicSmash as SeismicSmash } from './seismic-smash';
import { HurlBoulder as HurlBoulder } from './hurl-boulder';
import { Tremor as Tremor } from './tremor';

export const powerset: Powerset = {
  id: 'brute/stone-melee',
  name: 'Stone Melee',
  description: 'You can use the powers of earth and stone to do battle with your foes. Stone Melee allows you to strike with fists of stone, summon earthen weapons, and even quake the very ground itself.',
  icon: 'stone_melee_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    StoneFist,
    StoneMallet,
    HeavyMallet,
    BuildUp,
    Fault,
    Taunt,
    SeismicSmash,
    HurlBoulder,
    Tremor,
  ],
};

export default powerset;
