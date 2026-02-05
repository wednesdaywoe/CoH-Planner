/**
 * Earth Manipulation Powerset
 * You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target's Defense, while most Stone attacks will knock foes off their feet.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/earth_manipulation
 */

import type { Powerset } from '@/types';

import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { StonePrison as StonePrison } from './stone-prison';
import { SaltCrystals as SaltCrystals } from './salt-crystals';
import { BuildUp as BuildUp } from './build-up';
import { Tremor as Tremor } from './tremor';
import { MudBath as MudBath } from './mud-bath';
import { BerylCrystals as BerylCrystals } from './beryl-crystals';
import { Fracture as Fracture } from './fracture';
import { SeismicSmash as SeismicSmash } from './seismic-smash';

export const powerset: Powerset = {
  id: 'blaster/earth-manipulation',
  name: 'Earth Manipulation',
  description: 'You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target\'s Defense, while most Stone attacks will knock foes off their feet.',
  icon: 'electricity_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    HeavyMallet,
    StonePrison,
    SaltCrystals,
    BuildUp,
    Tremor,
    MudBath,
    BerylCrystals,
    Fracture,
    SeismicSmash,
  ],
};

export default powerset;
