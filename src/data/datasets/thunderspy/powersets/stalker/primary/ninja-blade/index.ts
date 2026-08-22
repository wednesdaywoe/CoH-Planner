/**
 * Ninja Blade Powerset
 * Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy's Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/ninja_sword
 */

import type { Powerset } from '@/types';

import { Hack as Hack } from './hack';
import { Slash as Slash } from './slash';
import { Slice as Slice } from './slice';
import { AssassinsBlade as AssassinsBlade } from './assassins-blade';
import { BuildUp as BuildUp } from './build-up';
import { Parry as Parry } from './parry';
import { Placate as Placate } from './placate';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'stalker/ninja-blade',
  setPath: 'Stalker_Melee.Ninja_Sword',
  name: 'Ninja Blade',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Wield a Ninja Blade and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Ninja Blade can reduce an enemy's Defense. The Ninja Blade is a fine blade that always has a bonus to Accuracy. Like all Stalker primary attack powers, Ninja Blade attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.",
  icon: 'ninja_sword_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    Hack,
    Slash,
    Slice,
    AssassinsBlade,
    BuildUp,
    Parry,
    Placate,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
