/**
 * Broad Sword Powerset
 * Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword's weight strikes with more force and damage. The Broadsword can reduce an enemy's Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/broad_sword
 */

import type { Powerset } from '@/types';

import { AssassinsSlash as AssassinsSlash } from './assassins-slash';
import { Slash as Slash } from './slash';
import { BoomerangSlice as BoomerangSlice } from './boomerang-slice';
import { Slice as Slice } from './slice';
import { BuildUp as BuildUp } from './build-up';
import { Disembowel as Disembowel } from './disembowel';
import { Hack as Hack } from './hack';
import { HeadSplitter as HeadSplitter } from './head-splitter';
import { Parry as Parry } from './parry';
import { Placate as Placate } from './placate';

export const powerset: Powerset = {
  id: 'stalker/broad-sword',
  name: 'Broad Sword',
  description: 'Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword\'s weight strikes with more force and damage. The Broadsword can reduce an enemy\'s Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.',
  icon: 'broad_sword_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsSlash,
    Slash,
    BoomerangSlice,
    Slice,
    BuildUp,
    Disembowel,
    Hack,
    HeadSplitter,
    Parry,
    Placate,
  ],
};

export default powerset;
