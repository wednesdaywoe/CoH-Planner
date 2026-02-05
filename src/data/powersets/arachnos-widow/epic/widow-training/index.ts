/**
 * Widow Training Powerset
 * Characters with Widow Training begin their careers as Blood Widows. Blood Widow characters begin with modest melee, ranged and buff skills. Beginning at level 24, they may chose to switch to the "Fortunata" path or remain on the "Widow" path and become "Night Widows." Night Widows gain considerably stronger melee capabilities, and only have modest ranged abilities, while those who go with the Fortunata path learn stronger ranged attack abilities and control abilities.
 *
 * Archetype: arachnos-widow
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { PoisonDart } from './poison-dart';
import { Swipe } from './swipe';
import { Strike } from './strike';
import { DartBurst } from './dart-burst';
import { FollowUp } from './follow-up';
import { Spin } from './spin';
import { Lunge } from './lunge';
import { Confront } from './confront';

export const powerset: Powerset = {
  id: 'arachnos-widow/widow-training',
  name: 'Widow Training',
  description: 'Characters with Widow Training begin their careers as Blood Widows. Blood Widow characters begin with modest melee, ranged and buff skills. Beginning at level 24, they may chose to switch to the "Fortunata" path or remain on the "Widow" path and become "Night Widows." Night Widows gain considerably stronger melee capabilities, and only have modest ranged abilities, while those who go with the Fortunata path learn stronger ranged attack abilities and control abilities.',
  icon: 'widow_training_set.png',
  archetype: 'arachnos-widow',
  category: 'epic',
  powers: [
    PoisonDart,
    Swipe,
    Strike,
    DartBurst,
    FollowUp,
    Spin,
    Lunge,
    Confront,
  ],
};

export default powerset;
