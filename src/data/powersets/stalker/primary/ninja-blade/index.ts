/**
 * Ninja Blade Powerset
 * Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy's Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/ninja_sword
 */

import type { Powerset } from '@/types';

import { StingoftheWasp as StingoftheWasp } from './sting-of-the-wasp';
import { GamblersCut as GamblersCut } from './gambler-s-cut';
import { FlashingSteel as FlashingSteel } from './flashing-steel';
import { AssassinsBlade as AssassinsBlade } from './assassin-s-blade';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { DivineAvalanche as DivineAvalanche } from './divine-avalanche';
import { SoaringDragon as SoaringDragon } from './soaring-dragon';
import { GoldenDragonfly as GoldenDragonfly } from './golden-dragonfly';

export const powerset: Powerset = {
  id: 'stalker/ninja-blade',
  name: 'Ninja Blade',
  description: 'Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy\'s Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'ninja_sword_set.png',
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
