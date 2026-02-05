/**
 * War Mace Powerset
 * You can wield a Medieval Mace and master a variety of powerful Smashing attacks. Attack speeds are good, and the weight of the Mace has good Disorienting capabilities. The sheer weight of this weapon gives it a bonus to hit.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/war_mace
 */

import type { Powerset } from '@/types';

import { Bash as Bash } from './bash';
import { Pulverize as Pulverize } from './pulverize';
import { Jawbreaker as Jawbreaker } from './jawbreaker';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { WhirlingMace as WhirlingMace } from './whirling-mace';
import { Clobber as Clobber } from './clobber';
import { Shatter as Shatter } from './shatter';
import { CrowdControl as CrowdControl } from './crowd-control';

export const powerset: Powerset = {
  id: 'tanker/war-mace',
  name: 'War Mace',
  description: 'You can wield a Medieval Mace and master a variety of powerful Smashing attacks. Attack speeds are good, and the weight of the Mace has good Disorienting capabilities. The sheer weight of this weapon gives it a bonus to hit.',
  icon: 'war_mace_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Bash,
    Pulverize,
    Jawbreaker,
    Taunt,
    BuildUp,
    WhirlingMace,
    Clobber,
    Shatter,
    CrowdControl,
  ],
};

export default powerset;
