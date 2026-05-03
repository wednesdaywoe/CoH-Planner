/**
 * Energy Assault Powerset
 * Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/energy_assault
 */

import type { Powerset } from '@/types';

import { PowerBolt as PowerBolt } from './power-bolt';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { PowerPush as PowerPush } from './power-push';
import { PowerBlast as PowerBlast } from './power-blast';
import { BuildUp as BuildUp } from './build-up';
import { WhirlingHands as WhirlingHands } from './whirling-hands';
import { PowerBurst as PowerBurst } from './power-burst';
import { SniperBlast as SniperBlast } from './sniper-blast';
import { TotalFocus as TotalFocus } from './total-focus';

export const powerset: Powerset = {
  id: 'guardian/energy-assault',
  name: 'Energy Assault',
  description: 'Focus pure energy into deadly melee attacks and powerful projectiles. The impact of the melee powers can often Disorient opponents, while the velocity of the ranged projectiles can send your enemies flying.',
  icon: 'energy_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    PowerBolt,
    BoneSmasher,
    PowerPush,
    PowerBlast,
    BuildUp,
    WhirlingHands,
    PowerBurst,
    SniperBlast,
    TotalFocus,
  ],
};

export default powerset;
