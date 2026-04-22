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
import { PowerBlast as PowerBlast } from './power-blast';
import { PowerBolt as PowerBolt } from './power-bolt';
import { PowerUp as PowerUp } from './power-boost';
import { PowerBurst as PowerBurst } from './power-burst';
import { PowerPush as PowerPush } from './power-push';
import { SniperBlast as SniperBlast } from './sniper-blast';
import { TotalFocus as TotalFocus } from './total-focus';
import { WhirlingHands as WhirlingHands } from './whirling-hands';

export const powerset: Powerset = {
  id: 'dominator/energy-assault',
  name: 'Energy Assault',
  description: 'Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.',
  icon: 'energy_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    BoneSmasher,
    PowerBlast,
    PowerBolt,
    PowerUp,
    PowerBurst,
    PowerPush,
    SniperBlast,
    TotalFocus,
    WhirlingHands,
  ],
};

export default powerset;
