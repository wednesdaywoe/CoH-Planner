/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy. Like all scrapper powers, all Katana attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/katana
 */

import type { Powerset } from '@/types';

import { Hack as Hack } from './hack';
import { Slash as Slash } from './slash';
import { Slice as Slice } from './slice';
import { BuildUp as BuildUp } from './build-up';
import { Parry as Parry } from './parry';
import { Taunt as Taunt } from './taunt';
import { WhirlingSword as WhirlingSword } from './whirling-sword';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'scrapper/katana',
  setPath: 'Scrapper_Melee.Katana',
  name: 'Katana',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy. Like all scrapper powers, all Katana attacks can sometimes land a critical hit for double damage.',
  icon: 'katana_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Hack,
    Slash,
    Slice,
    BuildUp,
    Parry,
    Taunt,
    WhirlingSword,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
