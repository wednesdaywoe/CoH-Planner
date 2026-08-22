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
import { Mesmerize as Mesmerize } from './mesmerize';
import { Levitate as Levitate } from './levitate';
import { Terrify as Terrify } from './terrify';
import { MassConfusion as MassConfusion } from './mass-confusion';
import { MassHypnosis as MassHypnosis } from './mass-hypnosis';
import { Telekinesis as Telekinesis } from './telekinesis';
import { TotalDomination as TotalDomination } from './total-domination';

export const powerset: Powerset = {
  id: 'controller/mind-control',
  setPath: 'Controller_Control.Mind_Control',
  name: 'Mind Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You can manipulate and control your opponent's mind. Since Mental powers directly affect the mind, most tend to be very accurate, and thus very useful against higher level foes. Few foes can resist Psionic powers, but creatures without minds, like machines and robots, are resistant to many of the effects.",
  icon: 'mind_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Confuse,
    Dominate,
    Mesmerize,
    Levitate,
    Terrify,
    MassConfusion,
    MassHypnosis,
    Telekinesis,
    TotalDomination,
  ],
};

export default powerset;
