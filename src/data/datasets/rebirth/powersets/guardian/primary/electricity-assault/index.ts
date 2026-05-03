/**
 * Electricity Assault Powerset
 * Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/electricity_assault
 */

import type { Powerset } from '@/types';

import { ChargedBolts as ChargedBolts } from './charged-bolts';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { LightningBolt as LightningBolt } from './lightning-bolt';
import { ChainInduction as ChainInduction } from './chain-induction';
import { BuildUp as BuildUp } from './build-up';
import { StaticDischarge as StaticDischarge } from './static-discharge';
import { HavocPunch as HavocPunch } from './havoc-punch';
import { Zapp as Zapp } from './zapp';
import { LightningRod as LightningRod } from './lightning-rod';

export const powerset: Powerset = {
  id: 'guardian/electricity-assault',
  name: 'Electricity Assault',
  description: 'Electrical Assault grants you several electrical ranged and melee powers. Electrical powers can drain foes\' Endurance and can often temporarily halt their Endurance recovery. This can be quite effective against higher level foes and Bosses. Some Electrical Assault powers can even sometimes transfer this Endurance back to you.',
  icon: 'electricity_manipulation_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    ChargedBolts,
    ChargedBrawl,
    LightningBolt,
    ChainInduction,
    BuildUp,
    StaticDischarge,
    HavocPunch,
    Zapp,
    LightningRod,
  ],
};

export default powerset;
