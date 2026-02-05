/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/energy_melee
 */

import type { Powerset } from '@/types';

import { Barrage as Barrage } from './barrage';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { AssassinsStrike as AssassinsStrike } from './assassin-s-strike';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { PowerCrash as PowerCrash } from './power-crash';
import { TotalFocus as TotalFocus } from './total-focus';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';

export const powerset: Powerset = {
  id: 'stalker/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.',
  icon: 'energy_melee_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    Barrage,
    EnergyPunch,
    BoneSmasher,
    AssassinsStrike,
    BuildUp,
    Placate,
    PowerCrash,
    TotalFocus,
    EnergyTransfer,
  ],
};

export default powerset;
