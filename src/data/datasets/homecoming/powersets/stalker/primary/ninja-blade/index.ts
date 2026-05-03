/**
 * Ninja Blade Powerset
 * Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy's Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/ninja_sword
 */

import type { Powerset } from '@/types';

import { StingoftheWasp as StingoftheWasp } from './hack';
import { GamblersCut as GamblersCut } from './slash';
import { FlashingSteel as FlashingSteel } from './slice';
import { AssassinsBlade as AssassinsBlade } from './assassins-blade';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { DivineAvalanche as DivineAvalanche } from './parry';
import { SoaringDragon as SoaringDragon } from './disembowel';
import { GoldenDragonfly as GoldenDragonfly } from './head-splitter';

export const powerset: Powerset = {
  id: 'stalker/ninja-blade',
  name: 'Ninja Blade',
  description: 'Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy\'s Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'ninja_sword_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    StingoftheWasp,
    GamblersCut,
    FlashingSteel,
    AssassinsBlade,
    BuildUp,
    Placate,
    DivineAvalanche,
    SoaringDragon,
    GoldenDragonfly,
  ],
};

export default powerset;
