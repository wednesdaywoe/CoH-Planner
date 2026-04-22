/**
 * Super Reflexes Powerset
 * Your Super Reflexes and acute senses allow you to react deftly to avoid danger. Regardless of what comes at you, Super Reflexes simply allow you to avoid the attack. The type of weapon or attack used against you is irrelevant. So swords, bullets, fire, energy, even Psionic Attacks can be avoided. Super Reflexes focuses on different techniques. Avoiding melee attacks is different than avoiding ranged attacks or even area-of-effect attacks. Your weakness is your opponents accuracy.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/super_reflexes
 */

import type { Powerset } from '@/types';

import { Agile as Agile } from './agile';
import { Dodge as Dodge } from './dodge';
import { Elude as Elude } from './elude';
import { Enduring as Enduring } from './enduring';
import { Evasion as Evasion } from './evasion';
import { FocusedFighting as FocusedFighting } from './focused-fighting';
import { FocusedSenses as FocusedSenses } from './focused-senses';
import { MasterBrawler as MasterBrawler } from './master-brawler';
import { PracticedBrawler as PracticedBrawler } from './practiced-brawler';
import { Quickness as Quickness } from './quickness';

export const powerset: Powerset = {
  id: 'sentinel/super-reflexes',
  name: 'Super Reflexes',
  description: 'Your Super Reflexes and acute senses allow you to react deftly to avoid danger. Regardless of what comes at you, Super Reflexes simply allow you to avoid the attack. The type of weapon or attack used against you is irrelevant. So swords, bullets, fire, energy, even Psionic Attacks can be avoided. Super Reflexes focuses on different techniques. Avoiding melee attacks is different than avoiding ranged attacks or even area-of-effect attacks. Your weakness is your opponents accuracy.',
  icon: 'super_reflexes_set.ico',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    Agile,
    Dodge,
    Elude,
    Enduring,
    Evasion,
    FocusedFighting,
    FocusedSenses,
    MasterBrawler,
    PracticedBrawler,
    Quickness,
  ],
};

export default powerset;
