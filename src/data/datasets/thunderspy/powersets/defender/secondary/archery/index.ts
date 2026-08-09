/**
 * Archery Powerset
 * The ancient art of Archery allows you to use a Bow and Arrow to great effect.  This power set has an inherent bonus to Accuracy.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/archery
 */

import type { Powerset } from '@/types';

import { SnapShot as SnapShot } from './snap-shot';
import { AimedShot as AimedShot } from './aimed-shot';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { BlazingArrow as BlazingArrow } from './blazing-arrow';
import { ExplosiveArrow as ExplosiveArrow } from './explosive-arrow';
import { Aim as Aim } from './aim';
import { StunningShot as StunningShot } from './stunning-shot';
import { RangedShot as RangedShot } from './ranged-shot';
import { RainofArrows as RainofArrows } from './rain-of-arrows';

export const powerset: Powerset = {
  id: 'defender/archery',
  internalName: 'archery',
  name: 'Archery',
  description: 'The ancient art of Archery allows you to use a Bow and Arrow to great effect.  This power set has an inherent bonus to Accuracy.',
  icon: 'archery_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    SnapShot,
    AimedShot,
    FistfulofArrows,
    BlazingArrow,
    ExplosiveArrow,
    Aim,
    StunningShot,
    RangedShot,
    RainofArrows,
  ],
};

export default powerset;
