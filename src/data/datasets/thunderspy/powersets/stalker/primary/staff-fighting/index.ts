/**
 * Staff Fighting Powerset
 * You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs.  Staff Fighting provides a good amount of control effects as well as some self buffs.  By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/staff_fighting
 */

import type { Powerset } from '@/types';

import { MercurialBlow as MercurialBlow } from './mercurial-blow';
import { PreciseStrike as PreciseStrike } from './precise-strike';
import { GuardedSpin as GuardedSpin } from './guarded-spin';
import { AssassinsStaff as AssassinsStaff } from './assassins-staff';
import { BuildUp as BuildUp } from './build-up';
import { EyeoftheStorm as EyeoftheStorm } from './eye-of-the-storm';
import { SerpentsReach as SerpentsReach } from './serpents-reach';
import { Placate as Placate } from './placate';
import { SkySplitter as SkySplitter } from './sky-splitter';

export const powerset: Powerset = {
  id: 'stalker/staff-fighting',
  internalName: 'staff_fighting',
  name: 'Staff Fighting',
  description: 'You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs.  Staff Fighting provides a good amount of control effects as well as some self buffs.  By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.',
  icon: 'staff_fighting_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    MercurialBlow,
    PreciseStrike,
    GuardedSpin,
    AssassinsStaff,
    BuildUp,
    EyeoftheStorm,
    SerpentsReach,
    Placate,
    SkySplitter,
  ],
};

export default powerset;
