/**
 * Archery Powerset
 * The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/archery
 */

import type { Powerset } from '@/types';

import { AimedShot as AimedShot } from './aimed-shot';
import { SnapShot as SnapShot } from './snap-shot';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { StunningShot as StunningShot } from './stunning-shot';
import { Aim as Aim } from './aim';
import { ExplosiveArrow as ExplosiveArrow } from './explosive-arrow';
import { BlazingArrow as BlazingArrow } from './blazing-arrow';
import { PerfectShot as PerfectShot } from './perfect-shot';
import { RainofArrows as RainofArrows } from './rain-of-arrows';

export const powerset: Powerset = {
  id: 'sentinel/archery',
  name: 'Archery',
  description: 'The ancient art of Archery allows you to use a Bow and Arrow to great effect. This power set has an inherent bonus to Accuracy.',
  icon: 'archery_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    AimedShot,
    SnapShot,
    FistfulofArrows,
    StunningShot,
    Aim,
    ExplosiveArrow,
    BlazingArrow,
    PerfectShot,
    RainofArrows,
  ],
};

export default powerset;
