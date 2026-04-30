/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents.
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
import { StaggeringBurst as StaggeringBurst } from './stun';
import { BuildUp as BuildUp } from './build-up';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';
import { TotalFocus as TotalFocus } from './total-focus';

export const powerset: Powerset = {
  id: 'tanker/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents.',
  icon: 'energy_melee_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Barrage,
    EnergyPunch,
    BoneSmasher,
    Taunt,
    WhirlingHands,
    StaggeringBurst,
    BuildUp,
    EnergyTransfer,
    TotalFocus,
  ],
};

export default powerset;
