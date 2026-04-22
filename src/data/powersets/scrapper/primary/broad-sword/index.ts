/**
 * Broad Sword Powerset
 * Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword's weight strikes with more force and damage. The Broadsword can reduce an enemy's Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy. Like all scrapper powers, all Broad Sword attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/broad_sword
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
import { Confront as Confront } from './taunt';
import { WhirlingSword as WhirlingSword } from './whirling-sword';

export const powerset: Powerset = {
  id: 'scrapper/broad-sword',
  name: 'Broad Sword',
  description: 'Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword\'s weight strikes with more force and damage. The Broadsword can reduce an enemy\'s Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy. Like all scrapper powers, all Broad Sword attacks can sometimes land a critical hit for double damage.',
  icon: 'broad_sword_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BoomerangSlice,
    Slice,
    BuildUp,
    Disembowel,
    Hack,
    HeadSplitter,
    Parry,
    Slash,
    Confront,
    WhirlingSword,
  ],
};

export default powerset;
