/**
 * Electricity Manipulation Powerset
 * Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes' Endurance and temporarily halt their Endurance recovery. Some powers return a portion of drained Endurance to you.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { ElectricFence as ElectricFence } from './electric-fence';
import { HavocPunch as HavocPunch } from './havok-punch';
import { Dynamo as Dynamo } from './lightning-clap';
import { ForceofThunder as ForceofThunder } from './lightning-field';
import { PowerSink as PowerSink } from './power-sink';
import { ShockingGrasp as ShockingGrasp } from './shocking-grasp';
import { ThunderStrike as ThunderStrike } from './thunder-strike';

export const powerset: Powerset = {
  id: 'blaster/electricity-manipulation',
  name: 'Electricity Manipulation',
  description: 'Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes\' Endurance and temporarily halt their Endurance recovery. Some powers return a portion of drained Endurance to you.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    BuildUp,
    ChargedBrawl,
    ElectricFence,
    HavocPunch,
    Dynamo,
    ForceofThunder,
    PowerSink,
    ShockingGrasp,
    ThunderStrike,
  ],
};

export default powerset;
