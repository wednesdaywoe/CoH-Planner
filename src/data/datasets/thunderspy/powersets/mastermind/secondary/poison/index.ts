/**
 * Poison Powerset
 * You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies.  When used correctly, some Poisons can even be used to aid your allies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/poison
 */

import type { Powerset } from '@/types';

import { Envenom as Envenom } from './envenom';
import { Alkaloid as Alkaloid } from './alkaloid';
import { AlkaloidSplash as AlkaloidSplash } from './alkaloid-splash';
import { Weaken as Weaken } from './weaken';
import { ParalyticPoison as ParalyticPoison } from './paralytic-poison';
import { NoxiousGas as NoxiousGas } from './noxious-gas';
import { VenomousGas as VenomousGas } from './venomous-gas';
import { NeurotoxicBreath as NeurotoxicBreath } from './neurotoxic-breath';
import { HallucinogenicSpray as HallucinogenicSpray } from './hallucinogenic-spray';
import { Antidote as Antidote } from './antidote';
import { ElixirofLife as ElixirofLife } from './elixir-of-life';
import { PoisonTrap as PoisonTrap } from './poison-trap';

export const powerset: Powerset = {
  id: 'mastermind/poison',
  setPath: 'Mastermind_Buff.Poison',
  name: 'Poison',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You are a master of Poison and can concoct a variety of venoms and toxins allowing you to weaken your enemies.  When used correctly, some Poisons can even be used to aid your allies.",
  icon: 'poison_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Envenom,
    Alkaloid,
    AlkaloidSplash,
    Weaken,
    ParalyticPoison,
    NoxiousGas,
    VenomousGas,
    NeurotoxicBreath,
    HallucinogenicSpray,
    Antidote,
    ElixirofLife,
    PoisonTrap,
  ],
};

export default powerset;
