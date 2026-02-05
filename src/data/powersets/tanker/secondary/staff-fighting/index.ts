/**
 * Staff Fighting Powerset
 * You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/staff_fighting
 */

import type { Powerset } from '@/types';

import { FormoftheBody as FormoftheBody } from './form-of-the-body';
import { FormoftheMind as FormoftheMind } from './form-of-the-mind';
import { FormoftheSoul as FormoftheSoul } from './form-of-the-soul';
import { MercurialBlow as MercurialBlow } from './mercurial-blow';
import { PreciseStrike as PreciseStrike } from './precise-strike';
import { GuardedSpin as GuardedSpin } from './guarded-spin';
import { Taunt as Taunt } from './taunt';
import { EyeoftheStorm as EyeoftheStorm } from './eye-of-the-storm';
import { StaffMastery as StaffMastery } from './staff-mastery';
import { SerpentsReach as SerpentsReach } from './serpent-s-reach';
import { InnocuousStrikes as InnocuousStrikes } from './innocuous-strikes';
import { SkySplitter as SkySplitter } from './sky-splitter';

export const powerset: Powerset = {
  id: 'tanker/staff-fighting',
  name: 'Staff Fighting',
  description: 'You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.',
  icon: 'staff_fighting_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    FormoftheBody,
    FormoftheMind,
    FormoftheSoul,
    MercurialBlow,
    PreciseStrike,
    GuardedSpin,
    Taunt,
    EyeoftheStorm,
    StaffMastery,
    SerpentsReach,
    InnocuousStrikes,
    SkySplitter,
  ],
};

export default powerset;
