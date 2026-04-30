/**
 * Electricity Manipulation Powerset
 * Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes' Endurance and temporarily halt their Endurance recovery.  Some powers return a portion of drained Endurance to you.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { ElectricFence as ElectricFence } from './electric-fence';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { LightningField as LightningField } from './lightning-field';
import { HavocPunch as HavocPunch } from './havok-punch';
import { BuildUp as BuildUp } from './build-up';
import { ForceofThunder as ForceofThunder } from './lightning-clap';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { PowerSink as PowerSink } from './power-sink';
import { ShockingGrasp as ShockingGrasp } from './shocking-grasp';

export const powerset: Powerset = {
  id: 'blaster/electricity-manipulation',
  name: 'Electricity Manipulation',
  description: 'Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes\' Endurance and temporarily halt their Endurance recovery.  Some powers return a portion of drained Endurance to you.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ElectricFence,
    ChargedBrawl,
    LightningField,
    HavocPunch,
    BuildUp,
    ForceofThunder,
    ThunderStrike,
    PowerSink,
    ShockingGrasp,
  ],
};

export default powerset;
