/**
 * Claws Powerset
 * Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Stalker melee sets. Like all Stalker primary attack powers, Claw attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/claws
 */

import type { Powerset } from '@/types';

import { Strike as Strike } from './strike';
import { Swipe as Swipe } from './swipe';
import { Slash as Slash } from './slash';
import { AssassinsClaw as AssassinsClaw } from './assassin-s-claw';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { Focus as Focus } from './focus';
import { Eviscerate as Eviscerate } from './eviscerate';
import { Shockwave as Shockwave } from './shockwave';

export const powerset: Powerset = {
  id: 'stalker/claws',
  name: 'Claws',
  description: 'Claws are bones or blades that extend from your hands and cause Lethal damage. The lightweight, natural feel of claws gives this power set a reduced Endurance cost and faster attack rate than other Stalker melee sets. Like all Stalker primary attack powers, Claw attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'claws_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    Strike,
    Swipe,
    Slash,
    AssassinsClaw,
    BuildUp,
    Placate,
    Focus,
    Eviscerate,
    Shockwave,
  ],
};

export default powerset;
