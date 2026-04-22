/**
 * Archery Powerset
 * The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/archery
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { AimedShot as AimedShot } from './aimed-shot';
import { BlazingArrow as BlazingArrow } from './blazing-arrow';
import { ExplosiveArrow as ExplosiveArrow } from './explosive-arrow';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { RainofArrows as RainofArrows } from './rain-of-arrows';
import { RangedShot as RangedShot } from './ranged-shot';
import { SnapShot as SnapShot } from './snap-shot';
import { StunningShot as StunningShot } from './stunning-shot';

export const powerset: Powerset = {
  id: 'corruptor/archery',
  name: 'Archery',
  description: 'The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.',
  icon: 'archery_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Aim,
    AimedShot,
    BlazingArrow,
    ExplosiveArrow,
    FistfulofArrows,
    RainofArrows,
    RangedShot,
    SnapShot,
    StunningShot,
  ],
};

export default powerset;
