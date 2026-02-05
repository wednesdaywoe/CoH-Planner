/**
 * War Mace Powerset
 * You can wield a Medieval Mace and master a variety of powerful Smashing attacks. Attack speeds are good, and the weight of the Mace has good Disorienting capabilities. The sheer weight of this weapon give it a bonus to hit.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/war_mace
 */

import type { Powerset } from '@/types';

import { Bash as Bash } from './bash';
import { Pulverize as Pulverize } from './pulverize';
import { Jawbreaker as Jawbreaker } from './jawbreaker';
import { BuildUp as BuildUp } from './build-up';
import { Clobber as Clobber } from './clobber';
import { Taunt as Taunt } from './taunt';
import { WhirlingMace as WhirlingMace } from './whirling-mace';
import { Shatter as Shatter } from './shatter';
import { CrowdControl as CrowdControl } from './crowd-control';

export const powerset: Powerset = {
  id: 'brute/war-mace',
  name: 'War Mace',
  description: 'You can wield a Medieval Mace and master a variety of powerful Smashing attacks. Attack speeds are good, and the weight of the Mace has good Disorienting capabilities. The sheer weight of this weapon give it a bonus to hit.',
  icon: 'war_mace_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    Bash,
    Pulverize,
    Jawbreaker,
    BuildUp,
    Clobber,
    Taunt,
    WhirlingMace,
    Shatter,
    CrowdControl,
  ],
};

export default powerset;
