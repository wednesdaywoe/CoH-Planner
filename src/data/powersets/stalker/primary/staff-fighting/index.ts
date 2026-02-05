/**
 * Staff Fighting Powerset
 * You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. Your melee attacks build stacks of Perfection of Body. Once you have three stacks of this power using Eye of the Storm or Sky Splitter will result in a more powerful effect and will consume all 3 stacks of Perfection of Body.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/staff_fighting
 */

import type { Powerset } from '@/types';

import { MercurialBlow as MercurialBlow } from './mercurial-blow';
import { PreciseStrike as PreciseStrike } from './precise-strike';
import { GuardedSpin as GuardedSpin } from './guarded-spin';
import { AssassinsStaff as AssassinsStaff } from './assassin-s-staff';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { EyeoftheStorm as EyeoftheStorm } from './eye-of-the-storm';
import { SerpentsReach as SerpentsReach } from './serpent-s-reach';
import { SkySplitter as SkySplitter } from './sky-splitter';

export const powerset: Powerset = {
  id: 'stalker/staff-fighting',
  name: 'Staff Fighting',
  description: 'You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. Your melee attacks build stacks of Perfection of Body. Once you have three stacks of this power using Eye of the Storm or Sky Splitter will result in a more powerful effect and will consume all 3 stacks of Perfection of Body.',
  icon: 'staff_fighting_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    MercurialBlow,
    PreciseStrike,
    GuardedSpin,
    AssassinsStaff,
    BuildUp,
    Placate,
    EyeoftheStorm,
    SerpentsReach,
    SkySplitter,
  ],
};

export default powerset;
