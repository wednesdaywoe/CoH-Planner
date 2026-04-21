/**
 * Electricity Assault Powerset
 * Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { ChargedBolts as ChargedBolts } from './electric-fence';
import { HavocPunch as HavocPunch } from './havok-punch';
import { Zapp as Zapp } from './lightning-clap';
import { LightningBolt as LightningBolt } from './lightning-field';
import { ThunderStrike as ThunderStrike } from './power-sink';
import { VoltaicSentinel as VoltaicSentinel } from './shocking-grasp';
import { StaticDischarge as StaticDischarge } from './thunder-strike';

export const powerset: Powerset = {
  id: 'dominator/electricity-assault',
  name: 'Electricity Assault',
  description: 'Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    BuildUp,
    ChargedBrawl,
    ChargedBolts,
    HavocPunch,
    Zapp,
    LightningBolt,
    ThunderStrike,
    VoltaicSentinel,
    StaticDischarge,
  ],
};

export default powerset;
