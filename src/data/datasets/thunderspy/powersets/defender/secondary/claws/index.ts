/**
 * Claws Powerset
 * Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Brute melee sets.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/claws
 */

import type { Powerset } from '@/types';

import { Strike as Strike } from './strike';
import { Swipe as Swipe } from './swipe';
import { Slash as Slash } from './slash';
import { Spin as Spin } from './spin';
import { FollowUp as FollowUp } from './follow-up';
import { Taunt as Taunt } from './taunt';
import { Focus as Focus } from './focus';
import { Shockwave as Shockwave } from './shockwave';
import { Eviscerate as Eviscerate } from './eviscerate';

export const powerset: Powerset = {
  id: 'defender/claws',
  setPath: 'Defender_Ranged.Claws',
  name: 'Claws',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Brute melee sets.',
  icon: 'claws_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Strike,
    Swipe,
    Slash,
    Spin,
    FollowUp,
    Taunt,
    Focus,
    Shockwave,
    Eviscerate,
  ],
};

export default powerset;
