/**
 * Street Justice Powerset
 * Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice's attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they're improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/brawling
 */

import type { Powerset } from '@/types';

import { HeavyBlow as HeavyBlow } from './heavy-blow';
import { InitialStrike as InitialStrike } from './initial-strike';
import { SweepingCross as SweepingCross } from './sweeping-cross';
import { Taunt as Taunt } from './taunt';
import { CombatReadiness as CombatReadiness } from './combat-readiness';
import { RibCracker as RibCracker } from './rib-cracker';
import { SpinningStrike as SpinningStrike } from './spinning-strike';
import { ShinBreaker as ShinBreaker } from './shin-breaker';
import { CrushingUppercut as CrushingUppercut } from './crushing-uppercut';

export const powerset: Powerset = {
  id: 'tanker/street-justice',
  name: 'Street Justice',
  description: 'Street Justice delivers punishing bone crushing attacks that weaken, disable or otherwise hinder their foes. This melee power set has no singular form of secondary effect. Instead, it has many ways to cripple enemies. Street Justice\'s attack powers come in two categories: Combo Builders and Finishers. Combo Builders add to your Combo Level and thus empower any Finishers you use. See individual powers for how they\'re improved by Combo Level. Combo Building powers can provide up to 3 levels of benefits. Build up to the third level before executing a Finisher for maximum effectiveness.',
  icon: 'brawling_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    HeavyBlow,
    InitialStrike,
    SweepingCross,
    Taunt,
    CombatReadiness,
    RibCracker,
    SpinningStrike,
    ShinBreaker,
    CrushingUppercut,
  ],
};

export default powerset;
