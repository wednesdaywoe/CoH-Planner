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
import { Defibrillate as Defibrillate } from './defibrillate';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { LightningField as LightningField } from './lightning-field';
import { HavokPunch as HavokPunch } from './havok-punch';
import { BuildUp as BuildUp } from './build-up';
import { LightningClap as LightningClap } from './lightning-clap';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { PowerSink as PowerSink } from './power-sink';
import { ShockingGrasp as ShockingGrasp } from './shocking-grasp';

export const powerset: Powerset = {
  id: 'dominator/electricity-assault',
  name: 'Electricity Assault',
  description: 'Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    ElectricFence,
    Defibrillate,
    ChargedBrawl,
    LightningField,
    HavokPunch,
    BuildUp,
    LightningClap,
    ThunderStrike,
    PowerSink,
    ShockingGrasp,
  ],
};

export default powerset;
