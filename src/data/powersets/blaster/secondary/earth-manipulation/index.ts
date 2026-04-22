/**
 * Earth Manipulation Powerset
 * You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target's Defense, while most Stone attacks will knock foes off their feet.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/earth_manipulation
 */

import type { Powerset } from '@/types';

import { BerylCrystals as BerylCrystals } from './beryl-crystals';
import { BuildUp as BuildUp } from './build-up';
import { Fracture as Fracture } from './fracture';
import { HeavyMallet as HeavyMallet } from './heavy-mallet';
import { MudBath as MudBath } from './mud-bath';
import { SaltCrystals as SaltCrystals } from './salt-crystals';
import { SeismicSmash as SeismicSmash } from './seismic-smash';
import { StonePrison as StonePrison } from './stone-prison';
import { Tremor as Tremor } from './tremor';

export const powerset: Powerset = {
  id: 'blaster/earth-manipulation',
  name: 'Earth Manipulation',
  description: 'You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target\'s Defense, while most Stone attacks will knock foes off their feet.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    BerylCrystals,
    BuildUp,
    Fracture,
    HeavyMallet,
    MudBath,
    SaltCrystals,
    SeismicSmash,
    StonePrison,
    Tremor,
  ],
};

export default powerset;
