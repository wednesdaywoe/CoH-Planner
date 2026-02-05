/**
 * Savage Melee Powerset
 * Tear at your foes with deadly animalistic attacks that primarily inflict Lethal damage and cause additional damage over time. Savage Strike, Maiming Slash, Shred, Assassin's Frenzy and Savage Leap all grant stacks of Blood Frenzy. Each stack of this buff grants a small recharge buff and endurance cost discount. You may have up to 5 stacks of Blood Frenzy active at a time. Blood Frenzy can be maintained, or it can be consumed to empower Rending Flurry, and Hemorrhage. Using one of these consumers while you have 5 stacks of Blood Frenzy offers an additional benefit to these powers, but will also leave you Exhausted for a short time. While Exhausted you cannot build Blood Frenzy.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/savage_melee
 */

import type { Powerset } from '@/types';

import { MaimingSlash as MaimingSlash } from './maiming-slash';
import { SavageStrike as SavageStrike } from './savage-strike';
import { Shred as Shred } from './shred';
import { AssassinsFrenzy as AssassinsFrenzy } from './assassin-s-frenzy';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { RendingFlurry as RendingFlurry } from './rending-flurry';
import { Hemorrhage as Hemorrhage } from './hemorrhage';
import { SavageLeap as SavageLeap } from './savage-leap';

export const powerset: Powerset = {
  id: 'stalker/savage-melee',
  name: 'Savage Melee',
  description: 'Tear at your foes with deadly animalistic attacks that primarily inflict Lethal damage and cause additional damage over time. Savage Strike, Maiming Slash, Shred, Assassin\'s Frenzy and Savage Leap all grant stacks of Blood Frenzy. Each stack of this buff grants a small recharge buff and endurance cost discount. You may have up to 5 stacks of Blood Frenzy active at a time. Blood Frenzy can be maintained, or it can be consumed to empower Rending Flurry, and Hemorrhage. Using one of these consumers while you have 5 stacks of Blood Frenzy offers an additional benefit to these powers, but will also leave you Exhausted for a short time. While Exhausted you cannot build Blood Frenzy.',
  icon: 'savage_melee_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    MaimingSlash,
    SavageStrike,
    Shred,
    AssassinsFrenzy,
    BuildUp,
    Placate,
    RendingFlurry,
    Hemorrhage,
    SavageLeap,
  ],
};

export default powerset;
