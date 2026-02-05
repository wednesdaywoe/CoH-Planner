/**
 * Electrical Melee Powerset
 * Electricity surges through your body and you can channel this electricity through your fists. Electrical Melee allows you to pummel your foes with various melee attack powers while jolting them with a powerful electric current. Electric Melee powers can drain foes' Endurance and temporarily halt their Endurance recovery. Some powers may even return a portion of drained Endurance back to you.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/electrical_melee
 */

import type { Powerset } from '@/types';

import { ChargedBrawl as ChargedBrawl } from './charged-brawl';
import { HavocPunch as HavocPunch } from './havoc-punch';
import { JacobsLadder as JacobsLadder } from './jacobs-ladder';
import { Taunt as Taunt } from './taunt';
import { ThunderStrike as ThunderStrike } from './thunder-strike';
import { BuildUp as BuildUp } from './build-up';
import { ChainInduction as ChainInduction } from './chain-induction';
import { LightningClap as LightningClap } from './lightning-clap';
import { LightningRod as LightningRod } from './lightning-rod';

export const powerset: Powerset = {
  id: 'tanker/electrical-melee',
  name: 'Electrical Melee',
  description: 'Electricity surges through your body and you can channel this electricity through your fists. Electrical Melee allows you to pummel your foes with various melee attack powers while jolting them with a powerful electric current. Electric Melee powers can drain foes\' Endurance and temporarily halt their Endurance recovery. Some powers may even return a portion of drained Endurance back to you.',
  icon: 'electrical_melee_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    ChargedBrawl,
    HavocPunch,
    JacobsLadder,
    Taunt,
    ThunderStrike,
    BuildUp,
    ChainInduction,
    LightningClap,
    LightningRod,
  ],
};

export default powerset;
