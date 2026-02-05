/**
 * Claws Powerset
 * Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Scrapper melee sets. Like all scrapper powers, all Claw attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/claws
 */

import type { Powerset } from '@/types';

import { Strike as Strike } from './strike';
import { Swipe as Swipe } from './swipe';
import { Slash as Slash } from './slash';
import { Spin as Spin } from './spin';
import { FollowUp as FollowUp } from './follow-up';
import { Confront as Confront } from './confront';
import { Focus as Focus } from './focus';
import { Eviscerate as Eviscerate } from './eviscerate';
import { Shockwave as Shockwave } from './shockwave';

export const powerset: Powerset = {
  id: 'scrapper/claws',
  name: 'Claws',
  description: 'Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Scrapper melee sets. Like all scrapper powers, all Claw attacks can sometimes land a critical hit for double damage.',
  icon: 'claws_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Strike,
    Swipe,
    Slash,
    Spin,
    FollowUp,
    Confront,
    Focus,
    Eviscerate,
    Shockwave,
  ],
};

export default powerset;
