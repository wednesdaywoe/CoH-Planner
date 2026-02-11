/**
 * Broad Sword Powerset
 * Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword's weight strikes with more force and damage. The Broadsword can reduce an enemy's Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/broad_sword
 */

import type { Powerset } from '@/types';

import { Hack as Hack } from './hack';
import { Slash as Slash } from './slash';
import { Slice as Slice } from './slice';
import { BoomerangSlice as BoomerangSlice } from './boomerang-slice';
import { Taunt as Taunt } from './taunt';
import { Parry as Parry } from './parry';
import { BuildUp as BuildUp } from './build-up';
import { WhirlingSword as WhirlingSword } from './whirling-sword';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'tanker/broad-sword',
  name: 'Broad Sword',
  description: 'Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword\'s weight strikes with more force and damage. The Broadsword can reduce an enemy\'s Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy.',
  icon: 'broad_sword_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Hack,
    Slash,
    Slice,
    BoomerangSlice,
    Taunt,
    Parry,
    BuildUp,
    WhirlingSword,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
