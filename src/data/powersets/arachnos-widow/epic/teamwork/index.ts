/**
 * Teamwork Powerset
 * Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/teamwork
 */

import type { Powerset } from '@/types';

import { IndomitableWill as IndomitableWill } from './indomitable-will';
import { Foresight as Foresight } from './foresight';

export const powerset: Powerset = {
  id: 'arachnos-widow/teamwork',
  name: 'Teamwork',
  description: 'Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.',
  icon: 'teamwork_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    IndomitableWill,
    Foresight,
  ],
};

export default powerset;
