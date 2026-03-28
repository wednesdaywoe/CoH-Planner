/**
 * Katana Powerset
 * Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy's Defense. The Katana is a fine blade that always has a bonus to Accuracy. Like all scrapper powers, all Katana attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/katana
 */

import type { Powerset } from '@/types';

import { StingoftheWasp as StingoftheWasp } from './hack';
import { GamblersCut as GamblersCut } from './slash';
import { FlashingSteel as FlashingSteel } from './slice';
import { BuildUp as BuildUp } from './build-up';
import { DivineAvalanche as DivineAvalanche } from './parry';
import { CallingtheWolf as CallingtheWolf } from './taunt';
import { TheLotusDrops as TheLotusDrops } from './whirling-sword';
import { SoaringDragon as SoaringDragon } from './disembowel';
import { GoldenDragonfly as GoldenDragonfly } from './head-splitter';

export const powerset: Powerset = {
  id: 'scrapper/katana',
  name: 'Katana',
  description: 'Wield a Katana and master a variety of powerful Lethal attacks. A quick and elegant weapon, the Katana is faster than a Broad Sword, and can reduce an enemy\'s Defense. The Katana is a fine blade that always has a bonus to Accuracy. Like all scrapper powers, all Katana attacks can sometimes land a critical hit for double damage.',
  icon: 'katana_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    StingoftheWasp,
    GamblersCut,
    FlashingSteel,
    BuildUp,
    DivineAvalanche,
    CallingtheWolf,
    TheLotusDrops,
    SoaringDragon,
    GoldenDragonfly,
  ],
};

export default powerset;
