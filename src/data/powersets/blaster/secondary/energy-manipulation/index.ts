/**
 * Energy Manipulation Powerset
 * Energy Manipulation allows you to channel energy to deliver deadly blows. These powers also help you focus your power to increase your own abilities.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/energy_manipulation
 */

import type { Powerset } from '@/types';

import { BoneSmasher as BoneSmasher } from './bone-smasher';
import { BoostRange as BoostRange } from './boost-range';
import { BuildUp as BuildUp } from './build-up';
import { Energize as Energize } from './conserve-power';
import { EnergyPunch as EnergyPunch } from './energy-punch';
import { PowerBoost as PowerBoost } from './power-boost';
import { PowerThrust as PowerThrust } from './power-thrust';
import { Stun as Stun } from './stun';
import { TotalFocus as TotalFocus } from './total-focus';

export const powerset: Powerset = {
  id: 'blaster/energy-manipulation',
  name: 'Energy Manipulation',
  description: 'Energy Manipulation allows you to channel energy to deliver deadly blows. These powers also help you focus your power to increase your own abilities.',
  icon: 'energy_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    BoneSmasher,
    BoostRange,
    BuildUp,
    Energize,
    EnergyPunch,
    PowerBoost,
    PowerThrust,
    Stun,
    TotalFocus,
  ],
};

export default powerset;
