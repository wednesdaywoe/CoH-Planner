/**
 * Archery Powerset
 * The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/archery
 */

import type { Powerset } from '@/types';

import { AimedShot as AimedShot } from './aimed-shot';
import { SnapShot as SnapShot } from './snap-shot';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { BlazingArrow as BlazingArrow } from './blazing-arrow';
import { Aim as Aim } from './aim';
import { ExplosiveArrow as ExplosiveArrow } from './explosive-arrow';
import { RangedShot as RangedShot } from './ranged-shot';
import { StunningShot as StunningShot } from './stunning-shot';
import { RainofArrows as RainofArrows } from './rain-of-arrows';

export const powerset: Powerset = {
  id: 'defender/archery',
  name: 'Archery',
  description: 'The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.',
  icon: 'archery_set.png',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    AimedShot,
    SnapShot,
    FistfulofArrows,
    BlazingArrow,
    Aim,
    ExplosiveArrow,
    RangedShot,
    StunningShot,
    RainofArrows,
  ],
};

export default powerset;
