/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/energy_melee
 */

import type { Powerset } from '@/types';

import { AssassinsStrike as AssassinsStrike } from './assassins-strike';
import { Barrage as Barrage } from './barrage';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { BuildUp as BuildUp } from './build-up';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';
import { Placate as Placate } from './placate';
import { PowerCrash as PowerCrash } from './stun';
import { TotalFocus as TotalFocus } from './total-focus';

export const powerset: Powerset = {
  id: 'stalker/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.',
  icon: 'energy_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsStrike,
    Barrage,
    BoneSmasher,
    BuildUp,
    EnergyPunch,
    EnergyTransfer,
    Placate,
    PowerCrash,
    TotalFocus,
  ],
};

export default powerset;
