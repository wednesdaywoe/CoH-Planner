/**
 * Staff Fighting Powerset
 * You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs.  Staff Fighting provides a good amount of control effects as well as some self buffs.  By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/staff_fighting
 */

import type { Powerset } from '@/types';

import { MercurialBlow as MercurialBlow } from './mercurial-blow';
import { PreciseStrike as PreciseStrike } from './precise-strike';
import { GuardedSpin as GuardedSpin } from './guarded-spin';
import { SerpentsReach as SerpentsReach } from './serpents-reach';
import { Confront as Confront } from './confront';
import { StaffMastery as StaffMastery } from './staff-mastery';
import { EyeoftheStorm as EyeoftheStorm } from './eye-of-the-storm';
import { InnocuousStrikes as InnocuousStrikes } from './innocuous-strikes';
import { SkySplitter as SkySplitter } from './sky-splitter';

export const powerset: Powerset = {
  id: 'defender/staff-fighting',
  name: 'Staff Fighting',
  description: 'You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs.  Staff Fighting provides a good amount of control effects as well as some self buffs.  By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.',
  icon: 'staff_fighting_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    MercurialBlow,
    PreciseStrike,
    GuardedSpin,
    SerpentsReach,
    Confront,
    StaffMastery,
    EyeoftheStorm,
    InnocuousStrikes,
    SkySplitter,
  ],
};

export default powerset;
