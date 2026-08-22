/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/katana
 */

import type { Powerset } from '@/types';

import { Hack as Hack } from './hack';
import { Slash as Slash } from './slash';
import { Slice as Slice } from './slice';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { Parry as Parry } from './parry';
import { WhirlingSword as WhirlingSword } from './whirling-sword';
import { Disembowel as Disembowel } from './disembowel';
import { HeadSplitter as HeadSplitter } from './head-splitter';

export const powerset: Powerset = {
  id: 'tanker/katana',
  setPath: 'Tanker_Melee.Katana',
  name: 'Katana',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy.",
  icon: 'katana_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Hack,
    Slash,
    Slice,
    Taunt,
    BuildUp,
    Parry,
    WhirlingSword,
    Disembowel,
    HeadSplitter,
  ],
};

export default powerset;
