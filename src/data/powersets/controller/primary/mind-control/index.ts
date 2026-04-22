/**
 * Mind Control Powerset
 * You can manipulate and control your opponent's mind. Since Mental powers directly affect the mind, most tend to be very accurate, and thus very useful against higher level foes. Few foes can resist Psionic powers, but creatures without minds, like machines and robots, are resistant to many of the effects.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/mind_control
 */

import type { Powerset } from '@/types';

import { Confuse as Confuse } from './confuse';
import { Dominate as Dominate } from './dominate';
import { Levitate as Levitate } from './levitate';
import { MassConfusion as MassConfusion } from './mass-confusion';
import { MassHypnosis as MassHypnosis } from './mass-hypnosis';
import { Mesmerize as Mesmerize } from './mesmerize';
import { Telekinesis as Telekinesis } from './telekinesis';
import { Terrify as Terrify } from './terrify';
import { TotalDomination as TotalDomination } from './total-domination';

export const powerset: Powerset = {
  id: 'controller/mind-control',
  name: 'Mind Control',
  description: 'You can manipulate and control your opponent\'s mind. Since Mental powers directly affect the mind, most tend to be very accurate, and thus very useful against higher level foes. Few foes can resist Psionic powers, but creatures without minds, like machines and robots, are resistant to many of the effects.',
  icon: 'mind_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Confuse,
    Dominate,
    Levitate,
    MassConfusion,
    MassHypnosis,
    Mesmerize,
    Telekinesis,
    Terrify,
    TotalDomination,
  ],
};

export default powerset;
