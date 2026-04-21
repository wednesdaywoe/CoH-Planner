/**
 * Street Justice Powerset
 * Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice's attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they're improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/brawling
 */

import type { Powerset } from '@/types';

import { AssassinsStrike as AssassinsStrike } from './assassins-strike';
import { BuildUp as BuildUp } from './build-up';
import { CrushingUppercut as CrushingUppercut } from './crushing-uppercut';
import { HeavyBlow as HeavyBlow } from './heavy-blow';
import { InitialStrike as InitialStrike } from './initial-strike';
import { ShinBreaker as ShinBreaker } from './low-kick';
import { Placate as Placate } from './placate';
import { SpinningStrike as SpinningStrike } from './spinning-strike';
import { SweepingCross as SweepingCross } from './sweeping-cross';

export const powerset: Powerset = {
  id: 'stalker/street-justice',
  name: 'Street Justice',
  description: 'Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice\'s attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they\'re improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.',
  icon: 'brawling_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsStrike,
    BuildUp,
    CrushingUppercut,
    HeavyBlow,
    InitialStrike,
    ShinBreaker,
    Placate,
    SpinningStrike,
    SweepingCross,
  ],
};

export default powerset;
