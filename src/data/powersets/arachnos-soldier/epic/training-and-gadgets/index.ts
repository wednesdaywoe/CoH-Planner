/**
 * Training and Gadgets Powerset
 * Those who enter the Soldier training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.
 *
 * Archetype: arachnos-soldier
 * Category: epic
 * Source: training_gadgets/training_and_gadgets
 */

import type { Powerset } from '@/types';

import { WolfSpiderArmor as WolfSpiderArmor } from './wolf-spider-armor';
import { CombatTrainingDefensive as CombatTrainingDefensive } from './combat-training-defensive';
import { CombatTrainingOffensive as CombatTrainingOffensive } from './combat-training-offensive';
import { TacticalTrainingManeuvers as TacticalTrainingManeuvers } from './tactical-training-maneuvers';
import { TacticalTrainingAssault as TacticalTrainingAssault } from './tactical-training-assault';
import { TacticalTrainingLeadership as TacticalTrainingLeadership } from './tactical-training-leadership';
import { MentalTraining as MentalTraining } from './mental-training';
import { CallReinforcements as CallReinforcements } from './call-reinforcements';

export const powerset: Powerset = {
  id: 'arachnos-soldier/training-and-gadgets',
  name: 'Training and Gadgets',
  description: 'Those who enter the Soldier training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.',
  icon: 'training_and_gadgets_set.png',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    WolfSpiderArmor,
    CombatTrainingDefensive,
    CombatTrainingOffensive,
    TacticalTrainingManeuvers,
    TacticalTrainingAssault,
    TacticalTrainingLeadership,
    MentalTraining,
    CallReinforcements,
  ],
};

export default powerset;
