/**
 * Electricity Manipulation Powerset
 * Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes' Endurance and temporarily halt their Endurance recovery. Some powers return a portion of drained Endurance to you.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { ElectricFence as ElectricFence } from './electric-fence';
import { BuildUp as BuildUp } from './build-up';
import { HavocPunch as HavocPunch } from './havoc-punch';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { Dynamo as Dynamo } from './dynamo';
import { PowerSink as PowerSink } from './power-sink';
import { ForceofThunder as ForceofThunder } from './force-of-thunder';
import { ShockingGrasp as ShockingGrasp } from './shocking-grasp';

export const powerset: Powerset = {
  id: 'blaster/electricity-manipulation',
  name: 'Electricity Manipulation',
  description: 'Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes\' Endurance and temporarily halt their Endurance recovery. Some powers return a portion of drained Endurance to you.',
  icon: 'electricity_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ChargedBrawl,
    ElectricFence,
    BuildUp,
    HavocPunch,
    ThunderStrike,
    Dynamo,
    PowerSink,
    ForceofThunder,
    ShockingGrasp,
  ],
};

export default powerset;
