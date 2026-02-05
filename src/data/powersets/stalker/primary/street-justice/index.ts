/**
 * Street Justice Powerset
 * Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice's attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they're improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/brawling
 */

import type { Powerset } from '@/types';

import { HeavyBlow as HeavyBlow } from './heavy-blow';
import { InitialStrike as InitialStrike } from './initial-strike';
import { SweepingCross as SweepingCross } from './sweeping-cross';
import { AssassinsStrike as AssassinsStrike } from './assassin-s-strike';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { SpinningStrike as SpinningStrike } from './spinning-strike';
import { ShinBreaker as ShinBreaker } from './shin-breaker';
import { CrushingUppercut as CrushingUppercut } from './crushing-uppercut';

export const powerset: Powerset = {
  id: 'stalker/street-justice',
  name: 'Street Justice',
  description: 'Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice\'s attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they\'re improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.',
  icon: 'brawling_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    HeavyBlow,
    InitialStrike,
    SweepingCross,
    AssassinsStrike,
    BuildUp,
    Placate,
    SpinningStrike,
    ShinBreaker,
    CrushingUppercut,
  ],
};

export default powerset;
