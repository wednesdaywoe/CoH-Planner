/**
 * Electrical Melee Powerset
 * Electricity surges through your body and you can channel this electricity through your fists. Electrical Melee allows you to pummel your foes with various melee attack powers while jolting them with a powerful electric current. Electric Melee powers can drain foes' Endurance and temporarily halt their Endurance recovery. Some powers may even return a portion of drained Endurance back to you.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/electrical_melee
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { ChainInduction as ChainInduction } from './chain-induction';
import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { Confront as Confront } from './confront';
import { HavocPunch as HavocPunch } from './havoc-punch';
import { JacobsLadder as JacobsLadder } from './jacobs-ladder';
import { LightningClap as LightningClap } from './lightning-clap';
import { LightningRod as LightningRod } from './lightning-rod';
import { ThunderStrike as ThunderStrike } from './thunder-strike';

export const powerset: Powerset = {
  id: 'scrapper/electrical-melee',
  name: 'Electrical Melee',
  description: 'Electricity surges through your body and you can channel this electricity through your fists. Electrical Melee allows you to pummel your foes with various melee attack powers while jolting them with a powerful electric current. Electric Melee powers can drain foes\' Endurance and temporarily halt their Endurance recovery. Some powers may even return a portion of drained Endurance back to you.',
  icon: 'electrical_melee_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BuildUp,
    ChainInduction,
    ChargedBrawl,
    Confront,
    HavocPunch,
    JacobsLadder,
    LightningClap,
    LightningRod,
    ThunderStrike,
  ],
};

export default powerset;
