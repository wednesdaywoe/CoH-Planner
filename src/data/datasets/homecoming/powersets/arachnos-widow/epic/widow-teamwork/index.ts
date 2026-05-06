/**
 * Widow Teamwork Powerset
 * Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/widow_teamwork
 */

import type { Powerset } from '@/types';

import { PainTolerance as PainTolerance } from './pain-tolerance';
import { MaskPresence as MaskPresence } from './nw-mask-presence';
import { MentalTraining as MentalTraining } from './mental-training';
import { MindLink as MindLink } from './nw-mind-link';
import { Placate as Placate } from './placate';
import { TacticalTrainingVengeance as TacticalTrainingVengeance } from './nw-tactical-training-vengeance';
import { Elude as Elude } from './elude';

export const powerset: Powerset = {
  id: 'arachnos-widow/widow-teamwork',
  name: 'Widow Teamwork',
  description: 'Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'widow_teamwork_set.ico',
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
