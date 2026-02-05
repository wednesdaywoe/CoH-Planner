/**
 * Shield Defense Powerset
 * Your mastery over the shield protects you from all forms of attacks in the form of defense as well as some moderate damage resistance to most types of damage. Your training with the shield enables you to protect your nearby allies boosting their defenses.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/shield_defense
 */

import type { Powerset } from '@/types';

import { Deflection as Deflection } from './deflection';
import { Hide as Hide } from './hide';
import { BattleAgility as BattleAgility } from './battle-agility';
import { TrueGrit as TrueGrit } from './true-grit';
import { ActiveDefense as ActiveDefense } from './active-defense';
import { AgainstAllOdds as AgainstAllOdds } from './against-all-odds';
import { GrantCover as GrantCover } from './grant-cover';
import { ShieldCharge as ShieldCharge } from './shield-charge';
import { OnewiththeShield as OnewiththeShield } from './one-with-the-shield';

export const powerset: Powerset = {
  id: 'stalker/shield-defense',
  name: 'Shield Defense',
  description: 'Your mastery over the shield protects you from all forms of attacks in the form of defense as well as some moderate damage resistance to most types of damage. Your training with the shield enables you to protect your nearby allies boosting their defenses.',
  icon: 'shield_defense_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Deflection,
    Hide,
    BattleAgility,
    TrueGrit,
    ActiveDefense,
    AgainstAllOdds,
    GrantCover,
    ShieldCharge,
    OnewiththeShield,
  ],
};

export default powerset;
