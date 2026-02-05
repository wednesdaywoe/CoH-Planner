/**
 * Fortunata Teamwork Powerset
 * Fortunata's receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { FateSealed } from './fate-sealed';
import { MaskPresence } from './mask-presence';
import { MindLink } from './mind-link';
import { Confuse } from './confuse';
import { TacticalTrainingVengeance } from './tactical-training-vengeance';
import { AuraofConfusion } from './aura-of-confusion';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-teamwork',
  name: 'Fortunata Teamwork',
  description: 'Fortunata\'s receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'fortunata_teamwork_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    FateSealed,
    MaskPresence,
    MindLink,
    Confuse,
    TacticalTrainingVengeance,
    AuraofConfusion,
  ],
};

export default powerset;
