/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/katana
 */

import type { Powerset } from '@/types';

import { Slash as Slash } from './slash';
import { Hack as Hack } from './hack';
import { Slice as Slice } from './slice';
import { Parry as Parry } from './parry';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { WhirlingSword as WhirlingSword } from './whirling-sword';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'defender/katana',
  setPath: 'Defender_Ranged.Katana',
  name: 'Katana',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy.',
  icon: 'katana_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Slash,
    Hack,
    Slice,
    Parry,
    Taunt,
    BuildUp,
    WhirlingSword,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
