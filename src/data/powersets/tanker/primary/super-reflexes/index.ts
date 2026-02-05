/**
 * Super Reflexes Powerset
 * Your Super Reflexes and acute senses allow you to react deftly to avoid danger. Regardless of what comes at you, Super Reflexes simply allows you to avoid the attack. The type of weapon or attack used against you is irrelevant. So swords, bullets, fire, energy, even Psionic Attacks can be avoided. Super Reflexes focuses on different techniques. Avoiding melee attacks is different than avoiding ranged attacks or even area-of-effect attacks. Your weakness is your opponents accuracy.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/super_reflexes
 */

import type { Powerset } from '@/types';

import { FocusedFighting as FocusedFighting } from './focused-fighting';
import { FocusedSenses as FocusedSenses } from './focused-senses';
import { Agile as Agile } from './agile';
import { PracticedBrawler as PracticedBrawler } from './practiced-brawler';
import { Dodge as Dodge } from './dodge';
import { Evasion as Evasion } from './evasion';
import { Lucky as Lucky } from './lucky';
import { Quickness as Quickness } from './quickness';
import { Elude as Elude } from './elude';

export const powerset: Powerset = {
  id: 'tanker/super-reflexes',
  name: 'Super Reflexes',
  description: 'Your Super Reflexes and acute senses allow you to react deftly to avoid danger. Regardless of what comes at you, Super Reflexes simply allows you to avoid the attack. The type of weapon or attack used against you is irrelevant. So swords, bullets, fire, energy, even Psionic Attacks can be avoided. Super Reflexes focuses on different techniques. Avoiding melee attacks is different than avoiding ranged attacks or even area-of-effect attacks. Your weakness is your opponents accuracy.',
  icon: 'super_reflexes_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    FocusedFighting,
    FocusedSenses,
    Agile,
    PracticedBrawler,
    Dodge,
    Evasion,
    Lucky,
    Quickness,
    Elude,
  ],
};

export default powerset;
