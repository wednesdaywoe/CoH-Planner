/**
 * Beast Mastery Powerset
 * Command wild animals to aid you in battle. These beastly allies lack ranged attacks, but make up for it with a specialized focus in melee combat. Call forth wolves, lions, dire wolves, hawks and insects to harass your foes. Additionally, you have a chance to gain a stack of Pack Mentality when you and your pets land a hit on an enemy. Each stack of Pack Mentality will boost the damage of all of your nearby beast henchmen. Pack Mentality can stack up to 10 times and will fade after a short time.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/beast_mastery
 */

import type { Powerset } from '@/types';

import { CallSwarm as CallSwarm } from './call-swarm';
import { SummonWolves as SummonWolves } from './summon-wolves';
import { CallHawk as CallHawk } from './call-hawk';
import { TrainBeasts as TrainBeasts } from './train-beasts';
import { CallRavens as CallRavens } from './call-ravens';
import { SummonLions as SummonLions } from './summon-lions';
import { FortifyPack as FortifyPack } from './fortify-pack';
import { SummonDireWolf as SummonDireWolf } from './summon-dire-wolf';
import { TameBeasts as TameBeasts } from './tame-beasts';

export const powerset: Powerset = {
  id: 'mastermind/beast-mastery',
  name: 'Beast Mastery',
  description: 'Command wild animals to aid you in battle. These beastly allies lack ranged attacks, but make up for it with a specialized focus in melee combat. Call forth wolves, lions, dire wolves, hawks and insects to harass your foes. Additionally, you have a chance to gain a stack of Pack Mentality when you and your pets land a hit on an enemy. Each stack of Pack Mentality will boost the damage of all of your nearby beast henchmen. Pack Mentality can stack up to 10 times and will fade after a short time.',
  icon: 'beast_mastery_set.png',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    CallSwarm,
    SummonWolves,
    CallHawk,
    TrainBeasts,
    CallRavens,
    SummonLions,
    FortifyPack,
    SummonDireWolf,
    TameBeasts,
  ],
};

export default powerset;
