/**
 * Staff Fighting Powerset
 * You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/staff_fighting
 */

import type { Powerset } from '@/types';

import { EyeoftheStorm as EyeoftheStorm } from './eye-of-the-storm';
import { FormoftheBody as FormoftheBody } from './form-of-the-body';
import { FormoftheMind as FormoftheMind } from './form-of-the-mind';
import { FormoftheSoul as FormoftheSoul } from './form-of-the-soul';
import { GuardedSpin as GuardedSpin } from './guarded-spin';
import { InnocuousStrikes as InnocuousStrikes } from './innocuous-strikes';
import { MercurialBlow as MercurialBlow } from './mercurial-blow';
import { PreciseStrike as PreciseStrike } from './precise-strike';
import { SerpentsReach as SerpentsReach } from './serpents-reach';
import { SkySplitter as SkySplitter } from './sky-splitter';
import { StaffMastery as StaffMastery } from './staff-mastery';
import { Taunt as Taunt } from './taunt';

export const powerset: Powerset = {
  id: 'tanker/staff-fighting',
  name: 'Staff Fighting',
  description: 'You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.',
  icon: 'staff_fighting_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    EyeoftheStorm,
    FormoftheBody,
    FormoftheMind,
    FormoftheSoul,
    GuardedSpin,
    InnocuousStrikes,
    MercurialBlow,
    PreciseStrike,
    SerpentsReach,
    SkySplitter,
    StaffMastery,
    Taunt,
  ],
};

export default powerset;
