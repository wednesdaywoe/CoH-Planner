/**
 * Archery Powerset
 * The ancient art of Archery allows you to use a Bow and Arrow to great effect.  This power set has an inherent bonus to Accuracy.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/archery
 */

import type { Powerset } from '@/types';

import { SnapShot as SnapShot } from './snap-shot';
import { AimedShot as AimedShot } from './aimed-shot';
import { FistfulofArrows as FistfulofArrows } from './fistful-of-arrows';
import { ExplosiveArrow as ExplosiveArrow } from './explosive-arrow';
import { BlazingArrow as BlazingArrow } from './blazing-arrow';
import { StunningShot as StunningShot } from './stunning-shot';
import { Aim as Aim } from './aim';
import { RangedShot as RangedShot } from './ranged-shot';
import { RainofArrows as RainofArrows } from './rain-of-arrows';

export const powerset: Powerset = {
  id: 'blaster/archery',
  setPath: 'Blaster_Ranged.Archery',
  name: 'Archery',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "The ancient art of Archery allows you to use a Bow and Arrow to great effect.  This power set has an inherent bonus to Accuracy.",
  icon: 'archery_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    SnapShot,
    AimedShot,
    FistfulofArrows,
    ExplosiveArrow,
    BlazingArrow,
    StunningShot,
    Aim,
    RangedShot,
    RainofArrows,
  ],
};

export default powerset;
