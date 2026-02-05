/**
 * Energy Blast Powerset
 * Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/energy_blast
 */

import type { Powerset } from '@/types';

import { PowerBlast as PowerBlast } from './power-blast';
import { PowerBolt as PowerBolt } from './power-bolt';
import { EnergyTorrent as EnergyTorrent } from './energy-torrent';
import { PowerBurst as PowerBurst } from './power-burst';
import { SniperBlast as SniperBlast } from './sniper-blast';
import { Aim as Aim } from './aim';
import { PowerPush as PowerPush } from './power-push';
import { ExplosiveBlast as ExplosiveBlast } from './explosive-blast';
import { Nova as Nova } from './nova';

export const powerset: Powerset = {
  id: 'corruptor/energy-blast',
  name: 'Energy Blast',
  description: 'Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.',
  icon: 'energy_blast_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    PowerBlast,
    PowerBolt,
    EnergyTorrent,
    PowerBurst,
    SniperBlast,
    Aim,
    PowerPush,
    ExplosiveBlast,
    Nova,
  ],
};

export default powerset;
