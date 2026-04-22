/**
 * Energy Blast Powerset
 * Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/energy_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { EnergyTorrent as EnergyTorrent } from './energy-torrent';
import { ExplosiveBlast as ExplosiveBlast } from './explosive-blast';
import { Nova as Nova } from './nova';
import { PowerBlast as PowerBlast } from './power-blast';
import { PowerBolt as PowerBolt } from './power-bolt';
import { PowerBurst as PowerBurst } from './power-burst';
import { PowerPush as PowerPush } from './power-push';
import { SniperBlast as SniperBlast } from './sniper-blast';

export const powerset: Powerset = {
  id: 'defender/energy-blast',
  name: 'Energy Blast',
  description: 'Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.',
  icon: 'energy_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Aim,
    EnergyTorrent,
    ExplosiveBlast,
    Nova,
    PowerBlast,
    PowerBolt,
    PowerBurst,
    PowerPush,
    SniperBlast,
  ],
};

export default powerset;
