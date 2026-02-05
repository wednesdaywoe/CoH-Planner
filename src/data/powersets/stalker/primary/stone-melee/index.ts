/**
 * Stone Melee Powerset
 * You can use the powers of earth and stone to do battle with your foes. Stone Melee allows you to strike with fists of stone, summon earthen weapons, and even quake the very ground itself.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/stone_melee
 */

import type { Powerset } from '@/types';

import { StoneFist as StoneFist } from './stone-fist';
import { StoneMallet as StoneMallet } from './stone-mallet';
import { Fault as Fault } from './fault';
import { AssassinsSmash as AssassinsSmash } from './assassin-s-smash';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { SeismicMallet as SeismicMallet } from './seismic-mallet';
import { HurlBoulder as HurlBoulder } from './hurl-boulder';
import { Tremor as Tremor } from './tremor';

export const powerset: Powerset = {
  id: 'stalker/stone-melee',
  name: 'Stone Melee',
  description: 'You can use the powers of earth and stone to do battle with your foes. Stone Melee allows you to strike with fists of stone, summon earthen weapons, and even quake the very ground itself.',
  icon: 'stone_melee_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    StoneFist,
    StoneMallet,
    Fault,
    AssassinsSmash,
    BuildUp,
    Placate,
    SeismicMallet,
    HurlBoulder,
    Tremor,
  ],
};

export default powerset;
