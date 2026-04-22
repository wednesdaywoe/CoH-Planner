/**
 * Broad Sword Powerset
 * Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword's weight strikes with more force and damage. The Broadsword can reduce an enemy's Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/broad_sword
 */

import type { Powerset } from '@/types';

import { BoomerangSlice as BoomerangSlice } from './boomerang-slice';
import { Slice as Slice } from './slice';
import { BuildUp as BuildUp } from './build-up';
import { Disembowel as Disembowel } from './disembowel';
import { Hack as Hack } from './hack';
import { HeadSplitter as HeadSplitter } from './head-splitter';
import { Parry as Parry } from './parry';
import { Slash as Slash } from './slash';
import { Taunt as Taunt } from './taunt';
import { WhirlingSword as WhirlingSword } from './whirling-sword';

export const powerset: Powerset = {
  id: 'tanker/broad-sword',
  name: 'Broad Sword',
  description: 'Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword\'s weight strikes with more force and damage. The Broadsword can reduce an enemy\'s Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.',
  icon: 'broad_sword_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    BoomerangSlice,
    Slice,
    BuildUp,
    Disembowel,
    Hack,
    HeadSplitter,
    Parry,
    Slash,
    Taunt,
    WhirlingSword,
  ],
};

export default powerset;
