/**
 * Archery Powerset
 * The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/archery
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { AimedShot as AimedShot } from './aimed-shot';
import { BlazingArrow as BlazingArrow } from './blazing-arrow';
import { ExplosiveArrow as ExplosiveArrow } from './explosive-arrow';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { RainofArrows as RainofArrows } from './rain-of-arrows';
import { PerfectShot as PerfectShot } from './ranged-shot';
import { SnapShot as SnapShot } from './snap-shot';
import { StunningShot as StunningShot } from './stunning-shot';

export const powerset: Powerset = {
  id: 'sentinel/archery',
  name: 'Archery',
  description: 'The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.',
  icon: 'archery_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Aim,
    AimedShot,
    BlazingArrow,
    ExplosiveArrow,
    FistfulofArrows,
    RainofArrows,
    PerfectShot,
    SnapShot,
    StunningShot,
  ],
};

export default powerset;
