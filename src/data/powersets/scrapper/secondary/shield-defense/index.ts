/**
 * Shield Defense Powerset
 * Your mastery over the shield protects you from all forms of attacks in the form of defense as well as some moderate damage resistance to most types of damage. Your training with the shield enables you to protect your nearby allies boosting their defenses.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/shield_defense
 */

import type { Powerset } from '@/types';

import { Deflection as Deflection } from './active-defense';
import { AgainstAllOdds as AgainstAllOdds } from './against-all-odds';
import { ActiveDefense as ActiveDefense } from './battle-agility';
import { BattleAgility as BattleAgility } from './deflection';
import { GrantCover as GrantCover } from './grant-cover';
import { OnewiththeShield as OnewiththeShield } from './one-with-the-shield';
import { PhalanxFighting as PhalanxFighting } from './phalanx-fighting';
import { ShieldCharge as ShieldCharge } from './shield-charge';
import { TrueGrit as TrueGrit } from './true-grit';

export const powerset: Powerset = {
  id: 'scrapper/shield-defense',
  name: 'Shield Defense',
  description: 'Your mastery over the shield protects you from all forms of attacks in the form of defense as well as some moderate damage resistance to most types of damage. Your training with the shield enables you to protect your nearby allies boosting their defenses.',
  icon: 'shield_defense_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    Deflection,
    AgainstAllOdds,
    ActiveDefense,
    BattleAgility,
    GrantCover,
    OnewiththeShield,
    PhalanxFighting,
    ShieldCharge,
    TrueGrit,
  ],
};

export default powerset;
