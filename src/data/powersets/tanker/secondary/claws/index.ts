/**
 * Claws Powerset
 * Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Brute melee sets.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/claws
 */

import type { Powerset } from '@/types';

import { Strike as Strike } from './strike';
import { Swipe as Swipe } from './swipe';
import { Slash as Slash } from './slash';
import { Taunt as Taunt } from './taunt';
import { Spin as Spin } from './spin';
import { FollowUp as FollowUp } from './follow-up';
import { Focus as Focus } from './focus';
import { Eviscerate as Eviscerate } from './eviscerate';
import { Shockwave as Shockwave } from './shockwave';

export const powerset: Powerset = {
  id: 'tanker/claws',
  name: 'Claws',
  description: 'Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Brute melee sets.',
  icon: 'claws_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Strike,
    Swipe,
    Slash,
    Taunt,
    Spin,
    FollowUp,
    Focus,
    Eviscerate,
    Shockwave,
  ],
};

export default powerset;
