/**
 * Electricity Assault Powerset
 * Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { ElectricFence as ElectricFence } from './electric-fence';
import { HavokPunch as HavokPunch } from './havok-punch';
import { LightningField as LightningField } from './lightning-field';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { BuildUp as BuildUp } from './build-up';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { PowerSink as PowerSink } from './power-sink';
import { ShockingGrasp as ShockingGrasp } from './shocking-grasp';
import { LightningClap as LightningClap } from './lightning-clap';

export const powerset: Powerset = {
  id: 'dominator/electricity-assault',
  internalName: 'electricity_manipulation',
  name: 'Electricity Assault',
  description: 'Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    ElectricFence,
    HavokPunch,
    LightningField,
    ThunderStrike,
    BuildUp,
    ChargedBrawl,
    PowerSink,
    ShockingGrasp,
    LightningClap,
  ],
};

export default powerset;
