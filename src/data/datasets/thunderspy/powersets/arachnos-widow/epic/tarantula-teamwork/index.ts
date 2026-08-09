/**
 * Tarantula Teamwork Powerset
 * Tarantula Teamwork
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: teamwork/tarantula_teamwork
 */

import type { Powerset } from '@/types';

import { TarantulaConversion as TarantulaConversion } from './tarantula-conversion';
import { TRMindLink as TRMindLink } from './tr-mind-link';
import { ReinforcedExoskeleton as ReinforcedExoskeleton } from './reinforced-exoskeleton';
import { WillOfArachnae as WillOfArachnae } from './will-of-arachnae';

export const powerset: Powerset = {
  id: 'arachnos-widow/tarantula-teamwork',
  internalName: 'tarantula_teamwork',
  name: 'Tarantula Teamwork',
  description: 'Tarantula Teamwork',
  icon: 'tarantula_teamwork_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    TarantulaConversion,
    TRMindLink,
    ReinforcedExoskeleton,
    WillOfArachnae,
  ],
};

export default powerset;
