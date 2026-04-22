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
import { Dehydrate as Dehydrate } from './dehydrate';
import { Geyser as Geyser } from './geyser';
import { HydroBlast as HydroBlast } from './hydro-blast';
import { SteamSpray as SteamSpray } from './steam-spray';
import { TidalForces as TidalForces } from './tidal-forces';
import { WaterBurst as WaterBurst } from './water-burst';
import { WaterJet as WaterJet } from './water-jet';
import { Whirlpool as Whirlpool } from './whirlpool';

export const powerset: Powerset = {
  id: 'sentinel/water-blast',
  name: 'Water Blast',
  description: 'Water Blast grants you command over the power of water. This can be used to weaken and crush your foes with all the power of a tidal wave. Some Water Blast powers allow the user to build Tidal Power, while others consume Tidal Power. You can have 3 stacks of Tidal Power on yourself at a time. Your Tidal Power can be released to strengthen your Water Burst, Water Jet, Dehydrate and Geyser powers. Using these powers will remove all of your Tidal Power.',
  icon: 'water_blast_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    AquaBolt,
    Dehydrate,
    Geyser,
    HydroBlast,
    SteamSpray,
    TidalForces,
    WaterBurst,
    WaterJet,
    Whirlpool,
  ],
};

export default powerset;
