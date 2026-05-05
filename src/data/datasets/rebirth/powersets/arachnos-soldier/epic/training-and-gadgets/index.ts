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
import { MentalTraining as MentalTraining } from './mental-training';
import { CallReinforcements as CallReinforcements } from './call-reinforcements';

export const powerset: Powerset = {
  id: 'arachnos-soldier/training-and-gadgets',
  name: 'Training and Gadgets',
  description: 'Those who enter the Soldier training program are given crash courses in Teamwork, Tactical Analysis and Coordination of Assets.',
  icon: 'training_and_gadgets_set.ico',
  archetype: 'arachnos-soldier',
  category: 'epic',
  powers: [
    WolfSpiderArmor,
    MentalTraining,
    CallReinforcements,
  ],
};

export default powerset;
