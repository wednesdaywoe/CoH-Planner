/**
 * Widow Teamwork Powerset
 * Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/widow_teamwork
 */

import type { Powerset } from '@/types';

import { Elude as Elude } from './elude';
import { MentalTraining as MentalTraining } from './mental-training';
import { MaskPresence as MaskPresence } from './nw-mask-presence';
import { MindLink as MindLink } from './nw-mind-link';
import { PainTolerance as PainTolerance } from './pain-tolerance';
import { Placate as Placate } from './placate';

export const powerset: Powerset = {
  id: 'arachnos-widow/widow-teamwork',
  name: 'Widow Teamwork',
  description: 'Night Widows receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'widow_teamwork_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    Elude,
    MentalTraining,
    MaskPresence,
    MindLink,
    PainTolerance,
    Placate,
  ],
};

export default powerset;
