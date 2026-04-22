/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/energy_melee
 */

import type { Powerset } from '@/types';

import { Barrage as Barrage } from './barrage';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { BuildUp as BuildUp } from './build-up';
import { Confront as Confront } from './confront';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';
import { PowerCrash as PowerCrash } from './power-crash';
import { TotalFocus as TotalFocus } from './total-focus';
import { WhirlingHands as WhirlingHands } from './whirling-hands';

export const powerset: Powerset = {
  id: 'scrapper/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.',
  icon: 'energy_melee_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Barrage,
    BoneSmasher,
    BuildUp,
    Confront,
    EnergyPunch,
    EnergyTransfer,
    PowerCrash,
    TotalFocus,
    WhirlingHands,
  ],
};

export default powerset;
