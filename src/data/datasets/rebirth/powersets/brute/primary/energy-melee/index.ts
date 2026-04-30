/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/energy_melee
 */

import type { Powerset } from '@/types';

import { Barrage as Barrage } from './barrage';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { BuildUp as BuildUp } from './build-up';
import { WhirlingHands as WhirlingHands } from './whirling-hands';
import { Taunt as Taunt } from './taunt';
import { TotalFocus as TotalFocus } from './total-focus';
import { StaggeringBurst as StaggeringBurst } from './stun';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';

export const powerset: Powerset = {
  id: 'brute/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents.',
  icon: 'energy_melee_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    Barrage,
    EnergyPunch,
    BoneSmasher,
    BuildUp,
    WhirlingHands,
    Taunt,
    TotalFocus,
    StaggeringBurst,
    EnergyTransfer,
  ],
};

export default powerset;
