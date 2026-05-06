/**
 * Teamwork Powerset
 * Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/teamwork
 */

import type { Powerset } from '@/types';

import { CombatTrainingDefensive as CombatTrainingDefensive } from './combat-training-defensive';
import { CombatTrainingOffensive as CombatTrainingOffensive } from './combat-training-offensive';
import { TacticalTrainingManeuvers as TacticalTrainingManeuvers } from './tactical-training-maneuvers';
import { IndomitableWill as IndomitableWill } from './indomitable-will';
import { TacticalTrainingAssault as TacticalTrainingAssault } from './tactical-training-assault';
import { TacticalTrainingLeadership as TacticalTrainingLeadership } from './tactical-training-leadership';
import { Foresight as Foresight } from './foresight';

export const powerset: Powerset = {
  id: 'arachnos-widow/teamwork',
  name: 'Teamwork',
  description: 'Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.',
  icon: 'teamwork_set.ico',
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
