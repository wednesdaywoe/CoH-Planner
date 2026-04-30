/**
 * Energy Assault Powerset
 * Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/energy_assault
 */

import type { Powerset } from '@/types';

import { PowerBolt as PowerBolt } from './power-bolt';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { PowerPush as PowerPush } from './power-push';
import { PowerBlast as PowerBlast } from './power-blast';
import { PowerBoost as PowerBoost } from './power-boost';
import { WhirlingHands as WhirlingHands } from './whirling-hands';
import { TotalFocus as TotalFocus } from './total-focus';
import { SniperBlast as SniperBlast } from './sniper-blast';
import { PowerBurst as PowerBurst } from './power-burst';

export const powerset: Powerset = {
  id: 'dominator/energy-assault',
  name: 'Energy Assault',
  description: 'Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.',
  icon: 'energy_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    PowerBolt,
    BoneSmasher,
    PowerPush,
    PowerBlast,
    PowerBoost,
    WhirlingHands,
    TotalFocus,
    SniperBlast,
    PowerBurst,
  ],
};

export default powerset;
