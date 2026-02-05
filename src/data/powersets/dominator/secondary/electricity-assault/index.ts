/**
 * Electricity Assault Powerset
 * Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/electricity_manipulation
 */

import type { Powerset } from '@/types';

import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { ChargedBolts as ChargedBolts } from './charged-bolts';
import { LightningBolt as LightningBolt } from './lightning-bolt';
import { HavocPunch as HavocPunch } from './havoc-punch';
import { BuildUp as BuildUp } from './build-up';
import { Zapp as Zapp } from './zapp';
import { StaticDischarge as StaticDischarge } from './static-discharge';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { VoltaicSentinel as VoltaicSentinel } from './voltaic-sentinel';

export const powerset: Powerset = {
  id: 'dominator/electricity-assault',
  name: 'Electricity Assault',
  description: 'Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.',
  icon: 'electricity_manipulation_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    ChargedBrawl,
    ChargedBolts,
    LightningBolt,
    HavocPunch,
    BuildUp,
    Zapp,
    StaticDischarge,
    ThunderStrike,
    VoltaicSentinel,
  ],
};

export default powerset;
