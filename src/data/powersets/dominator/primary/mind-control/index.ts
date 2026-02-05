/**
 * Mind Control Powerset
 * You can manipulate and control your opponent's mind. Since Mental powers directly affect the mind, most tend to be very accurate, and thus very useful against higher level foes. Few foes can resist Psionic powers, but creatures without minds, like machines and robots, are resistant to many of the effects.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/mind_control
 */

import type { Powerset } from '@/types';

import { Levitate as Levitate } from './levitate';
import { Mesmerize as Mesmerize } from './mesmerize';
import { Dominate as Dominate } from './dominate';
import { Confuse as Confuse } from './confuse';
import { MassHypnosis as MassHypnosis } from './mass-hypnosis';
import { Telekinesis as Telekinesis } from './telekinesis';
import { TotalDomination as TotalDomination } from './total-domination';
import { Terrify as Terrify } from './terrify';
import { MassConfusion as MassConfusion } from './mass-confusion';

export const powerset: Powerset = {
  id: 'dominator/mind-control',
  name: 'Mind Control',
  description: 'You can manipulate and control your opponent\'s mind. Since Mental powers directly affect the mind, most tend to be very accurate, and thus very useful against higher level foes. Few foes can resist Psionic powers, but creatures without minds, like machines and robots, are resistant to many of the effects.',
  icon: 'mind_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Levitate,
    Mesmerize,
    Dominate,
    Confuse,
    MassHypnosis,
    Telekinesis,
    TotalDomination,
    Terrify,
    MassConfusion,
  ],
};

export default powerset;
