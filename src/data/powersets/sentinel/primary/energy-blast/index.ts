/**
 * Energy Blast Powerset
 * Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/energy_blast
 */

import type { Powerset } from '@/types';

import { PowerBlast as PowerBlast } from './power-blast';
import { PowerBolt as PowerBolt } from './power-bolt';
import { EnergyTorrent as EnergyTorrent } from './energy-torrent';
import { PowerBurst as PowerBurst } from './power-burst';
import { Aim as Aim } from './aim';
import { PowerPush as PowerPush } from './power-push';
import { ExplosiveBlast as ExplosiveBlast } from './explosive-blast';
import { FocusedPowerBolt as FocusedPowerBolt } from './focused-power-bolt';
import { Nova as Nova } from './nova';

export const powerset: Powerset = {
  id: 'sentinel/energy-blast',
  name: 'Energy Blast',
  description: 'Energy Blast allows you to hurl bolts of energy at your foes, and can often send them flying with Knockback.',
  icon: 'energy_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    PowerBlast,
    PowerBolt,
    EnergyTorrent,
    PowerBurst,
    Aim,
    PowerPush,
    ExplosiveBlast,
    FocusedPowerBolt,
    Nova,
  ],
};

export default powerset;
