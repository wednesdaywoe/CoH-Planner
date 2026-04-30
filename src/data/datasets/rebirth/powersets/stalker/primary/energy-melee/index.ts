/**
 * Energy Melee Powerset
 * You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Like all Stalker primary attack powers, Energy Melee attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/energy_melee
 */

import type { Powerset } from '@/types';

import { Barrage as Barrage } from './barrage';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { AssassinsStrike as AssassinsStrike } from './assassins-strike';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { StaggeringBurst as StaggeringBurst } from './stun';
import { EnergyTransfer as EnergyTransfer } from './energy-transfer';
import { TotalFocus as TotalFocus } from './total-focus';

export const powerset: Powerset = {
  id: 'stalker/energy-melee',
  name: 'Energy Melee',
  description: 'You can use Energy Melee to power your blows with pure energy. These focused power attacks often Disorient opponents. Like all Stalker primary attack powers, Energy Melee attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'energy_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    Barrage,
    EnergyPunch,
    BoneSmasher,
    AssassinsStrike,
    BuildUp,
    Placate,
    StaggeringBurst,
    EnergyTransfer,
    TotalFocus,
  ],
};

export default powerset;
