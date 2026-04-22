/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy. Like all scrapper powers, all Katana attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/katana
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { SoaringDragon as SoaringDragon } from './disembowel';
import { StingoftheWasp as StingoftheWasp } from './hack';
import { GoldenDragonfly as GoldenDragonfly } from './head-splitter';
import { DivineAvalanche as DivineAvalanche } from './parry';
import { GamblersCut as GamblersCut } from './slash';
import { FlashingSteel as FlashingSteel } from './slice';
import { CallingtheWolf as CallingtheWolf } from './taunt';
import { TheLotusDrops as TheLotusDrops } from './whirling-sword';

export const powerset: Powerset = {
  id: 'scrapper/katana',
  name: 'Katana',
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy. Like all scrapper powers, all Katana attacks can sometimes land a critical hit for double damage.',
  icon: 'katana_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BuildUp,
    SoaringDragon,
    StingoftheWasp,
    GoldenDragonfly,
    DivineAvalanche,
    GamblersCut,
    FlashingSteel,
    CallingtheWolf,
    TheLotusDrops,
  ],
};

export default powerset;
