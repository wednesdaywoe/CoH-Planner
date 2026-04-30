/**
 * Widow Training Powerset
 * Characters with Widow Training begin their careers as Blood Widows. Blood Widow characters begin with modest melee, ranged and buff skills.  Beginning at level 24, they may chose to switch to the "Fortunata" path or remain on the "Widow" path and become "Night Widows."  Night Widows gain considerably stronger melee capabilities, and only have modest ranged abilities, while those who go with the Fortunata path learn stronger ranged attack abilities and control abilities.
 *
 * Archetype: arachnos-widow
 * Category: epic
 * Source: widow_training/widow_training
 */

import type { Powerset } from '@/types';

import { PoisonDart as PoisonDart } from './poison-dart';
import { Swipe as Swipe } from './swipe';
import { Strike as Strike } from './lunge';
import { DartBurst as DartBurst } from './dart-burst';
import { FollowUp as FollowUp } from './follow-up';
import { Spin as Spin } from './spin';
import { Lunge as Lunge } from './strike';
import { Confront as Confront } from './confront';

export const powerset: Powerset = {
  id: 'arachnos-widow/widow-training',
  name: 'Widow Training',
  description: 'Characters with Widow Training begin their careers as Blood Widows. Blood Widow characters begin with modest melee, ranged and buff skills.  Beginning at level 24, they may chose to switch to the "Fortunata" path or remain on the "Widow" path and become "Night Widows."  Night Widows gain considerably stronger melee capabilities, and only have modest ranged abilities, while those who go with the Fortunata path learn stronger ranged attack abilities and control abilities.',
  icon: 'widow_training_set.ico',
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
