/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/katana
 */

import type { Powerset } from '@/types';

import { StingoftheWasp as StingoftheWasp } from './sting-of-the-wasp';
import { GamblersCut as GamblersCut } from './gambler-s-cut';
import { FlashingSteel as FlashingSteel } from './flashing-steel';
import { DragonsRoar as DragonsRoar } from './dragon-s-roar';
import { DivineAvalanche as DivineAvalanche } from './divine-avalanche';
import { BuildUp as BuildUp } from './build-up';
import { TheLotusDrops as TheLotusDrops } from './the-lotus-drops';
import { SoaringDragon as SoaringDragon } from './soaring-dragon';
import { GoldenDragonfly as GoldenDragonfly } from './golden-dragonfly';

export const powerset: Powerset = {
  id: 'tanker/katana',
  name: 'Katana',
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy.',
  icon: 'katana_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    StingoftheWasp,
    GamblersCut,
    FlashingSteel,
    DragonsRoar,
    DivineAvalanche,
    BuildUp,
    TheLotusDrops,
    SoaringDragon,
    GoldenDragonfly,
  ],
};

export default powerset;
