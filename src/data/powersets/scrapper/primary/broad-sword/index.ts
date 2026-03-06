/**
 * Broad Sword Powerset
 * Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword's weight strikes with more force and damage. The Broadsword can reduce an enemy's Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy. Like all scrapper powers, all Broad Sword attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/broad_sword
 */

import type { Powerset } from '@/types';

import { Hack as Hack } from './hack';
import { Slash as Slash } from './slash';
import { Slice as Slice } from './slice';
import { BuildUp as BuildUp } from './build-up';
import { Parry as Parry } from './parry';
import { Confront as Confront } from './confront';
import { WhirlingSword as WhirlingSword } from './whirling-sword';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'scrapper/broad-sword',
  name: 'Broad Sword',
  description: 'Wield a Broad Sword and master a variety of powerful Lethal attacks. Slower than a Katana, the Broad Sword\'s weight strikes with more force and damage. The Broadsword can reduce an enemy\'s Defense, allowing other attacks to hit more reliably. The Broad Sword is a powerful melee weapon that has a bonus to Accuracy. Like all scrapper powers, all Broad Sword attacks can sometimes land a critical hit for double damage.',
  icon: 'broad_sword_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Hack,
    Slash,
    Slice,
    BuildUp,
    Parry,
    Confront,
    WhirlingSword,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
