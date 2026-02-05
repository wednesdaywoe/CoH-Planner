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
import { Envenom as Envenom } from './envenom';
import { Weaken as Weaken } from './weaken';
import { NeurotoxicBreath as NeurotoxicBreath } from './neurotoxic-breath';
import { ElixirofLife as ElixirofLife } from './elixir-of-life';
import { Antidote as Antidote } from './antidote';
import { ParalyticPoison as ParalyticPoison } from './paralytic-poison';
import { PoisonTrap as PoisonTrap } from './poison-trap';
import { NoxiousGas as NoxiousGas } from './noxious-gas';

export const powerset: Powerset = {
  id: 'mastermind/poison',
  name: 'Poison',
  description: 'You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies. When used correctly, some Poisons can even be used to aid your allies.',
  icon: 'poison_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Alkaloid,
    Envenom,
    Weaken,
    NeurotoxicBreath,
    ElixirofLife,
    Antidote,
    ParalyticPoison,
    PoisonTrap,
    NoxiousGas,
  ],
};

export default powerset;
