/**
 * Super Reflexes Powerset
 * Your Super Reflexes and acute senses allow you to react deftly to avoid danger. Regardless of what comes at you, Super Reflexes simply allow you to avoid the attack. The type of weapon or attack used against you is irrelevant. So swords, bullets, fire, energy, even Psionic Attacks can be avoided. Super Reflexes focuses on different techniques. Avoiding melee attacks is different than avoiding ranged attacks or even area-of-effect attacks. Your weakness is your opponents accuracy.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/super_reflexes
 */

import type { Powerset } from '@/types';

import { Agile as Agile } from './agile';
import { Dodge as Dodge } from './dodge';
import { Elude as Elude } from './elude';
import { Evasion as Evasion } from './evasion';
import { FocusedFighting as FocusedFighting } from './focused-fighting';
import { FocusedSenses as FocusedSenses } from './focused-senses';
import { Lucky as Lucky } from './lucky';
import { PracticedBrawler as PracticedBrawler } from './practiced-brawler';
import { Quickness as Quickness } from './quickness';

export const powerset: Powerset = {
  id: 'brute/super-reflexes',
  name: 'Super Reflexes',
  description: 'Your Super Reflexes and acute senses allow you to react deftly to avoid danger. Regardless of what comes at you, Super Reflexes simply allow you to avoid the attack. The type of weapon or attack used against you is irrelevant. So swords, bullets, fire, energy, even Psionic Attacks can be avoided. Super Reflexes focuses on different techniques. Avoiding melee attacks is different than avoiding ranged attacks or even area-of-effect attacks. Your weakness is your opponents accuracy.',
  icon: 'super_reflexes_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    Agile,
    Dodge,
    Elude,
    Evasion,
    FocusedFighting,
    FocusedSenses,
    Lucky,
    PracticedBrawler,
    Quickness,
  ],
};

export default powerset;
