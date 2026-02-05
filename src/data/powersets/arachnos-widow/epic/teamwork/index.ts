/**
 * Teamwork Powerset
 * Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.
 *
 * Archetype: arachnos-widow
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { CombatTrainingDefensive } from './combat-training-defensive';
import { CombatTrainingOffensive } from './combat-training-offensive';
import { TacticalTrainingManeuvers } from './tactical-training-maneuvers';
import { IndomitableWill } from './indomitable-will';
import { TacticalTrainingAssault } from './tactical-training-assault';
import { TacticalTrainingLeadership } from './tactical-training-leadership';
import { Foresight } from './foresight';

export const powerset: Powerset = {
  id: 'arachnos-widow/teamwork',
  name: 'Teamwork',
  description: 'Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.',
  icon: 'teamwork_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    CombatTrainingDefensive,
    CombatTrainingOffensive,
    TacticalTrainingManeuvers,
    IndomitableWill,
    TacticalTrainingAssault,
    TacticalTrainingLeadership,
    Foresight,
  ],
};

export default powerset;
