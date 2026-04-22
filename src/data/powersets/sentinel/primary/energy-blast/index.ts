/**
 * Energy Blast Powerset
 * Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/energy_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { EnergyTorrent as EnergyTorrent } from './energy-torrent';
import { ExplosiveBlast as ExplosiveBlast } from './explosive-blast';
import { FocusedPowerBolt as FocusedPowerBolt } from './focused-power-bolt';
import { PowerBolt as PowerBolt } from './power-bolt';
import { Nova as Nova } from './nova';
import { PowerBlast as PowerBlast } from './power-blast';
import { PowerBurst as PowerBurst } from './power-burst';
import { PowerPush as PowerPush } from './power-push';

export const powerset: Powerset = {
  id: 'sentinel/energy-blast',
  name: 'Energy Blast',
  description: 'Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.',
  icon: 'energy_blast_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Aim,
    EnergyTorrent,
    ExplosiveBlast,
    FocusedPowerBolt,
    PowerBolt,
    Nova,
    PowerBlast,
    PowerBurst,
    PowerPush,
  ],
};

export default powerset;
