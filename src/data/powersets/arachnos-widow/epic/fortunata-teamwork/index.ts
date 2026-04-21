/**
 * Fortunata Teamwork Powerset
 * Fortunata's receive advanced Teamwork Training, couple with advanced defensive techniques of their own.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/fortunata_teamwork
 */

import type { Powerset } from '@/types';

import { AuraofConfusion as AuraofConfusion } from './aura-of-confusion';
import { Confuse as Confuse } from './confuse';
import { FateSealed as FateSealed } from './fate-sealed';
import { MaskPresence as MaskPresence } from './frt-mask-presence';
import { MindLink as MindLink } from './frt-mind-link';

export const powerset: Powerset = {
  id: 'arachnos-widow/fortunata-teamwork',
  name: 'Fortunata Teamwork',
  description: 'Fortunata\'s receive advanced Teamwork Training, couple with advanced defensive techniques of their own.',
  icon: 'fortunata_teamwork_set.ico',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    AuraofConfusion,
    Confuse,
    FateSealed,
    MaskPresence,
    MindLink,
  ],
};

export default powerset;
