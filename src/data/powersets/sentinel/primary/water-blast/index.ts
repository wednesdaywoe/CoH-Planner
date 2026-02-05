/**
 * Water Blast Powerset
 * Water Blast grants you command over the power of water. This can be used to weaken and crush your foes with all the power of a tidal wave. Some Water Blast powers allow the user to build Tidal Power, while others consume Tidal Power. You can have 3 stacks of Tidal Power on yourself at a time. Your Tidal Power can be released to strengthen your Water Burst, Water Jet, Dehydrate and Geyser powers. Using these powers will remove all of your Tidal Power.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/water_blast
 */

import type { Powerset } from '@/types';

import { AquaBolt as AquaBolt } from './aqua-bolt';
import { HydroBlast as HydroBlast } from './hydro-blast';
import { WaterBurst as WaterBurst } from './water-burst';
import { Dehydrate as Dehydrate } from './dehydrate';
import { TidalForces as TidalForces } from './tidal-forces';
import { Whirlpool as Whirlpool } from './whirlpool';
import { WaterJet as WaterJet } from './water-jet';
import { SteamSpray as SteamSpray } from './steam-spray';
import { Geyser as Geyser } from './geyser';

export const powerset: Powerset = {
  id: 'sentinel/water-blast',
  name: 'Water Blast',
  description: 'Water Blast grants you command over the power of water. This can be used to weaken and crush your foes with all the power of a tidal wave. Some Water Blast powers allow the user to build Tidal Power, while others consume Tidal Power. You can have 3 stacks of Tidal Power on yourself at a time. Your Tidal Power can be released to strengthen your Water Burst, Water Jet, Dehydrate and Geyser powers. Using these powers will remove all of your Tidal Power.',
  icon: 'water_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    AquaBolt,
    HydroBlast,
    WaterBurst,
    Dehydrate,
    TidalForces,
    Whirlpool,
    WaterJet,
    SteamSpray,
    Geyser,
  ],
};

export default powerset;
