/**
 * Arsenal Assault Powerset
 * You use your cutting edge rifle to not only devastate foes from range, but also wield it and other advanced munitions at short range to incapacitate anyone who gets too close
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/arsenal_assault
 */

import type { Powerset } from '@/types';

import { Burst as Burst } from './burst';
import { Buttstroke as Buttstroke } from './buttstroke';
import { Buckshot as Buckshot } from './buckshot';
import { HeavyBlow as HeavyBlow } from './heavy-blow';
import { PowerUp as PowerUp } from './power-up';
import { TripMine as TripMine } from './trip-mine';
import { TargetingDrone as TargetingDrone } from './targeting-drone';
import { SniperRifle as SniperRifle } from './sniper-rifle';
import { Ignite as Ignite } from './ignite';

export const powerset: Powerset = {
  id: 'dominator/arsenal-assault',
  setPath: 'Dominator_Assault.Arsenal_Assault',
  name: 'Arsenal Assault',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You use your cutting edge rifle to not only devastate foes from range, but also wield it and other advanced munitions at short range to incapacitate anyone who gets too close",
  icon: 'assault_rifle_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Burst,
    Buttstroke,
    Buckshot,
    HeavyBlow,
    PowerUp,
    TripMine,
    TargetingDrone,
    SniperRifle,
    Ignite,
  ],
};

export default powerset;
