/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/energy_melee
 */

import type { Powerset } from '@/types';

import { Barrage as Barrage } from './barrage';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { BuildUp as BuildUp } from './build-up';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';
import { PowerCrash as PowerCrash } from './stun';
import { Taunt as Taunt } from './taunt';
import { TotalFocus as TotalFocus } from './total-focus';
import { WhirlingHands as WhirlingHands } from './whirling-hands';

export const powerset: Powerset = {
  id: 'tanker/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.',
  icon: 'energy_melee_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Barrage,
    BoneSmasher,
    BuildUp,
    EnergyPunch,
    EnergyTransfer,
    PowerCrash,
    Taunt,
    TotalFocus,
    WhirlingHands,
  ],
};

export default powerset;
