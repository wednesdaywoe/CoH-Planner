/**
 * Staff Fighting Powerset
 * You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/staff_fighting
 */

import type { Powerset } from '@/types';

import { FormoftheBody as FormoftheBody } from './form-of-the-body';
import { FormoftheMind as FormoftheMind } from './form-of-the-mind';
import { FormoftheSoul as FormoftheSoul } from './form-of-the-soul';
import { MercurialBlow as MercurialBlow } from './mercurial-blow';
import { PreciseStrike as PreciseStrike } from './precise-strike';
import { GuardedSpin as GuardedSpin } from './guarded-spin';
import { EyeoftheStorm as EyeoftheStorm } from './eye-of-the-storm';
import { StaffMastery as StaffMastery } from './staff-mastery';
import { Confront as Confront } from './confront';
import { SerpentsReach as SerpentsReach } from './serpent-s-reach';
import { InnocuousStrikes as InnocuousStrikes } from './innocuous-strikes';
import { SkySplitter as SkySplitter } from './sky-splitter';

export const powerset: Powerset = {
  id: 'scrapper/staff-fighting',
  name: 'Staff Fighting',
  description: 'You have mastered the art of staff fighting, allowing you to strike at your foes in great sweeping arcs. Staff Fighting provides a good amount of control effects as well as some self buffs. By selecting the Staff Mastery power, you will gain access to techniques that further empower your Staff Fighting techniques and grant you useful augmentations that build up as you fight.',
  icon: 'staff_fighting_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    FormoftheBody,
    FormoftheMind,
    FormoftheSoul,
    MercurialBlow,
    PreciseStrike,
    GuardedSpin,
    EyeoftheStorm,
    StaffMastery,
    Confront,
    SerpentsReach,
    InnocuousStrikes,
    SkySplitter,
  ],
};

export default powerset;
