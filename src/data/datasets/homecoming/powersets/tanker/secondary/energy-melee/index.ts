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
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { Taunt as Taunt } from './taunt';
import { WhirlingHands as WhirlingHands } from './whirling-hands';
import { TotalFocus as TotalFocus } from './total-focus';
import { BuildUp as BuildUp } from './build-up';
import { Stun as Stun } from './stun';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';

export const powerset: Powerset = {
  id: 'tanker/energy-melee',
  internalName: 'energy_melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Total Focus will enter Energy Focus upon hitting an enemy. Barrage, Power Crash or Energy Transfer are empowered while under Energy Focus.',
  icon: 'energy_melee_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Barrage,
    EnergyPunch,
    BoneSmasher,
    Taunt,
    WhirlingHands,
    TotalFocus,
    BuildUp,
    Stun,
    EnergyTransfer,
  ],
};

export default powerset;
