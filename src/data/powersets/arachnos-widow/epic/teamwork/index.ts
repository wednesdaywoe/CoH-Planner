/**
 * Teamwork Powerset
 * Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/teamwork
 */

import type { Powerset } from '@/types';

import { Foresight as Foresight } from './foresight';
import { IndomitableWill as IndomitableWill } from './indomitable-will';

export const powerset: Powerset = {
  id: 'arachnos-widow/teamwork',
  name: 'Teamwork',
  description: 'Those who enter the Widow training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.',
  icon: 'teamwork_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    Foresight,
    IndomitableWill,
  ],
};

export default powerset;
