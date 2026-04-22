/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/katana
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { SoaringDragon as SoaringDragon } from './disembowel';
import { StingoftheWasp as StingoftheWasp } from './hack';
import { GoldenDragonfly as GoldenDragonfly } from './head-splitter';
import { DivineAvalanche as DivineAvalanche } from './parry';
import { GamblersCut as GamblersCut } from './slash';
import { FlashingSteel as FlashingSteel } from './slice';
import { DragonsRoar as DragonsRoar } from './taunt';
import { TheLotusDrops as TheLotusDrops } from './whirling-sword';

export const powerset: Powerset = {
  id: 'tanker/katana',
  name: 'Katana',
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy.',
  icon: 'katana_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    BuildUp,
    SoaringDragon,
    StingoftheWasp,
    GoldenDragonfly,
    DivineAvalanche,
    GamblersCut,
    FlashingSteel,
    DragonsRoar,
    TheLotusDrops,
  ],
};

export default powerset;
