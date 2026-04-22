/**
 * Poison Powerset
 * You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies. When used correctly, some Poisons can even be used to aid your allies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/poison
 */

import type { Powerset } from '@/types';

import { Alkaloid as Alkaloid } from './alkaloid';
import { Antidote as Antidote } from './antidote';
import { ElixirofLife as ElixirofLife } from './elixir-of-life';
import { Envenom as Envenom } from './envenom';
import { NeurotoxicBreath as NeurotoxicBreath } from './neurotoxic-breath';
import { NoxiousGas as NoxiousGas } from './noxious-gas';
import { ParalyticPoison as ParalyticPoison } from './paralytic-poison';
import { PoisonTrap as PoisonTrap } from './poison-trap';
import { Weaken as Weaken } from './weaken';

export const powerset: Powerset = {
  id: 'mastermind/poison',
  name: 'Poison',
  description: 'You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies. When used correctly, some Poisons can even be used to aid your allies.',
  icon: 'poison_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Alkaloid,
    Antidote,
    ElixirofLife,
    Envenom,
    NeurotoxicBreath,
    NoxiousGas,
    ParalyticPoison,
    PoisonTrap,
    Weaken,
  ],
};

export default powerset;
