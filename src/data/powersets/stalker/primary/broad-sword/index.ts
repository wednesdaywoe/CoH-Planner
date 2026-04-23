/**
 * Broad Sword Powerset
 * Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword's weight strikes with more force and damage. The Broadsword can reduce an enemy's Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/broad_sword
 */

import type { Powerset } from '@/types';

import { Hack as Hack } from './hack';
import { Slash as Slash } from './slash';
import { BoomerangSlice as BoomerangSlice } from './boomerang-slice';
import { Slice as Slice } from './slice';
import { AssassinsSlash as AssassinsSlash } from './assassins-slash';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { Parry as Parry } from './parry';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'stalker/broad-sword',
  name: 'Broad Sword',
  description: 'Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword\'s weight strikes with more force and damage. The Broadsword can reduce an enemy\'s Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.',
  icon: 'broad_sword_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    Hack,
    Slash,
    BoomerangSlice,
    Slice,
    AssassinsSlash,
    BuildUp,
    Placate,
    Parry,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
