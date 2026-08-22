/**
 * Electricity Manipulation Powerset
 * Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes' Endurance and temporarily halt their Endurance recovery. Some powers return a portion of drained Endurance to you.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { ElectricFence as ElectricFence } from './electric-fence';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { BuildUp as BuildUp } from './build-up';
import { HavokPunch as HavokPunch } from './havok-punch';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { LightningClap as LightningClap } from './lightning-clap';
import { PowerSink as PowerSink } from './power-sink';
import { LightningField as LightningField } from './lightning-field';
import { ShockingGrasp as ShockingGrasp } from './shocking-grasp';

export const powerset: Powerset = {
  id: 'blaster/electricity-manipulation',
  setPath: 'Blaster_Support.Electricity_Manipulation',
  name: 'Electricity Manipulation',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Electricity Manipulation empowers you with various electrical melee attack and support powers. Electricity Manipulation powers can drain foes' Endurance and temporarily halt their Endurance recovery. Some powers return a portion of drained Endurance to you.",
  icon: 'electricity_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ElectricFence,
    ChargedBrawl,
    BuildUp,
    HavokPunch,
    ThunderStrike,
    LightningClap,
    PowerSink,
    LightningField,
    ShockingGrasp,
  ],
};

export default powerset;
