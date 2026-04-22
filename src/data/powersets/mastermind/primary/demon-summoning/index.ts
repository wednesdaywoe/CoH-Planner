/**
 * Demon Summoning Powerset
 * Conjure demons from the depths of the netherworld and beyond. These demonic servitors wield hellfire and serve you through some dark compact. You are capable of summoning a variety of different infernal minions each with its own strengths and weaknesses.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/demon_summoning
 */

import type { Powerset } from '@/types';

import { AbyssalEmpowerment as AbyssalEmpowerment } from './abyssal-empowerment';
import { Corruption as Corruption } from './corruption';
import { CrackWhip as CrackWhip } from './crack-whip';
import { EnchantDemon as EnchantDemon } from './enchant-demon';
import { HellonEarth as HellonEarth } from './hell-on-earth';
import { Lash as Lash } from './lash';
import { SummonDemonPrince as SummonDemonPrince } from './summon-demon-prince';
import { SummonDemonlings as SummonDemonlings } from './summon-demonlings';
import { SummonDemons as SummonDemons } from './summon-demons';

export const powerset: Powerset = {
  id: 'mastermind/demon-summoning',
  name: 'Demon Summoning',
  description: 'Conjure demons from the depths of the netherworld and beyond. These demonic servitors wield hellfire and serve you through some dark compact. You are capable of summoning a variety of different infernal minions each with its own strengths and weaknesses.',
  icon: 'demon_summoning_set.ico',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    AbyssalEmpowerment,
    Corruption,
    CrackWhip,
    EnchantDemon,
    HellonEarth,
    Lash,
    SummonDemonPrince,
    SummonDemonlings,
    SummonDemons,
  ],
};

export default powerset;
