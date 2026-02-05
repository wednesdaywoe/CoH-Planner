/**
 * Widow Teamwork Powerset
 * Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { PainTolerance } from './pain-tolerance';
import { MaskPresence } from './mask-presence';
import { MentalTraining } from './mental-training';
import { MindLink } from './mind-link';
import { Placate } from './placate';
import { TacticalTrainingVengeance } from './tactical-training-vengeance';
import { Elude } from './elude';

export const powerset: Powerset = {
  id: 'arachnos-widow/widow-teamwork',
  name: 'Widow Teamwork',
  description: 'Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'widow_teamwork_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    PainTolerance,
    MaskPresence,
    MentalTraining,
    MindLink,
    Placate,
    TacticalTrainingVengeance,
    Elude,
  ],
};

export default powerset;
