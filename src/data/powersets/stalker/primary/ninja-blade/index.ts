/**
 * Ninja Blade Powerset
 * Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy's Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/ninja_sword
 */

import type { Powerset } from '@/types';

import { AssassinsBlade as AssassinsBlade } from './assassins-blade';
import { BuildUp as BuildUp } from './build-up';
import { SoaringDragon as SoaringDragon } from './disembowel';
import { StingoftheWasp as StingoftheWasp } from './hack';
import { GoldenDragonfly as GoldenDragonfly } from './head-splitter';
import { DivineAvalanche as DivineAvalanche } from './parry';
import { Placate as Placate } from './placate';
import { GamblersCut as GamblersCut } from './slash';
import { FlashingSteel as FlashingSteel } from './slice';

export const powerset: Powerset = {
  id: 'stalker/ninja-blade',
  name: 'Ninja Blade',
  description: 'Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy\'s Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'ninja_sword_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsBlade,
    BuildUp,
    SoaringDragon,
    StingoftheWasp,
    GoldenDragonfly,
    DivineAvalanche,
    Placate,
    GamblersCut,
    FlashingSteel,
  ],
};

export default powerset;
