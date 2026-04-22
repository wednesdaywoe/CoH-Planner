/**
 * Arsenal Assault Powerset
 * You use your cutting edge rifle to not only devastate foes from range, but also wield it and other advanced munitions at short range to incapacitate anyone who gets too close
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/arsenal_assault
 */

import type { Powerset } from '@/types';

import { Buckshot as Buckshot } from './buckshot';
import { Burst as Burst } from './burst';
import { Buttstroke as Buttstroke } from './buttstroke';
import { ElbowStrike as ElbowStrike } from './heavy-blow';
import { Ignite as Ignite } from './ignite';
import { PowerUp as PowerUp } from './power-up';
import { SniperRifle as SniperRifle } from './sniper-rifle';
import { TargetingDrone as TargetingDrone } from './targeting-drone';
import { TripMine as TripMine } from './trip-mine';

export const powerset: Powerset = {
  id: 'dominator/arsenal-assault',
  name: 'Arsenal Assault',
  description: 'You use your cutting edge rifle to not only devastate foes from range, but also wield it and other advanced munitions at short range to incapacitate anyone who gets too close',
  icon: 'assault_rifle_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Buckshot,
    Burst,
    Buttstroke,
    ElbowStrike,
    Ignite,
    PowerUp,
    SniperRifle,
    TargetingDrone,
    TripMine,
  ],
};

export default powerset;
