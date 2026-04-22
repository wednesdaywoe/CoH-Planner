/**
 * Poison Powerset
 * You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies. When used correctly, some Poisons can even be used to aid your allies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/poison
 */

import type { Powerset } from '@/types';

import { Alkaloid as Alkaloid } from './alkaloid';
import { Antidote as Antidote } from './antidote';
import { ElixirofLife as ElixirofLife } from './elixir-of-life';
import { Envenom as Envenom } from './envenom';
import { NeurotoxicBreath as NeurotoxicBreath } from './neurotoxic-breath';
import { ParalyticPoison as ParalyticPoison } from './paralytic-poison';
import { PoisonTrap as PoisonTrap } from './poison-trap';
import { VenomousGas as VenomousGas } from './venomous-gas';
import { Weaken as Weaken } from './weaken';

export const powerset: Powerset = {
  id: 'defender/poison',
  name: 'Poison',
  description: 'You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies. When used correctly, some Poisons can even be used to aid your allies.',
  icon: 'poison_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    Alkaloid,
    Antidote,
    ElixirofLife,
    Envenom,
    NeurotoxicBreath,
    ParalyticPoison,
    PoisonTrap,
    VenomousGas,
    Weaken,
  ],
};

export default powerset;
