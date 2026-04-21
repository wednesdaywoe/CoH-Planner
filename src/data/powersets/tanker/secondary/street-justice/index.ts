/**
 * Street Justice Powerset
 * Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice's attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they're improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/brawling
 */

import type { Powerset } from '@/types';

import { CombatReadiness as CombatReadiness } from './combat-readiness';
import { CrushingUppercut as CrushingUppercut } from './crushing-uppercut';
import { HeavyBlow as HeavyBlow } from './heavy-blow';
import { InitialStrike as InitialStrike } from './initial-strike';
import { ShinBreaker as ShinBreaker } from './low-kick';
import { SpinningStrike as SpinningStrike } from './spinning-strike';
import { SweepingCross as SweepingCross } from './sweeping-cross';
import { Taunt as Taunt } from './taunt';
import { RibCracker as RibCracker } from './throat-strike';

export const powerset: Powerset = {
  id: 'tanker/street-justice',
  name: 'Street Justice',
  description: 'Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice\'s attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they\'re improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.',
  icon: 'brawling_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    CombatReadiness,
    CrushingUppercut,
    HeavyBlow,
    InitialStrike,
    ShinBreaker,
    SpinningStrike,
    SweepingCross,
    Taunt,
    RibCracker,
  ],
};

export default powerset;
