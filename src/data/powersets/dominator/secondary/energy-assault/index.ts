/**
 * Energy Assault Powerset
 * Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/energy_assault
 */

import type { Powerset } from '@/types';

import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { PowerBolt as PowerBolt } from './power-bolt';
import { PowerPush as PowerPush } from './power-push';
import { PowerBlast as PowerBlast } from './power-blast';
import { PowerUp as PowerUp } from './power-up';
import { WhirlingHands as WhirlingHands } from './whirling-hands';
import { TotalFocus as TotalFocus } from './total-focus';
import { SniperBlast as SniperBlast } from './sniper-blast';
import { PowerBurst as PowerBurst } from './power-burst';

export const powerset: Powerset = {
  id: 'dominator/energy-assault',
  name: 'Energy Assault',
  description: 'Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.',
  icon: 'energy_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    BoneSmasher,
    PowerBolt,
    PowerPush,
    PowerBlast,
    PowerUp,
    WhirlingHands,
    TotalFocus,
    SniperBlast,
    PowerBurst,
  ],
};

export default powerset;
