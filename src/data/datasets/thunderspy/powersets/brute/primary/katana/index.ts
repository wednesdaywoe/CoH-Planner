/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/katana
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
  id: 'brute/katana',
  name: 'Katana',
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy.',
  icon: 'katana_set.ico',
  archetype: 'brute',
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
