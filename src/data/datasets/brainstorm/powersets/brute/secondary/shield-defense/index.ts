/**
 * Shield Defense Powerset
 * Your mastery over the shield protects you from all forms of attacks in the form of defense as well as some moderate damage resistance to most types of damage. Your training with the shield enables you to protect your nearby allies boosting their defenses.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/shield_defense
 */

import type { Powerset } from '@/types';

import { ActiveDefense as ActiveDefense } from './active-defense';
import { Deflection as Deflection } from './deflection';
import { TrueGrit as TrueGrit } from './true-grit';
import { BattleAgility as BattleAgility } from './battle-agility';
import { AgainstallOdds as AgainstallOdds } from './against-all-odds';
import { PhalanxFighting as PhalanxFighting } from './phalanx-fighting';
import { GrantCover as GrantCover } from './grant-cover';
import { ShieldCharge as ShieldCharge } from './shield-charge';
import { OnewiththeShield as OnewiththeShield } from './one-with-the-shield';

export const powerset: Powerset = {
  id: 'brute/shield-defense',
  setPath: 'Brute_Defense.Shield_Defense',
  name: 'Shield Defense',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Your mastery over the shield protects you from all forms of attacks in the form of defense as well as some moderate damage resistance to most types of damage. Your training with the shield enables you to protect your nearby allies boosting their defenses.",
  icon: 'shield_defense_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    ActiveDefense,
    Deflection,
    TrueGrit,
    BattleAgility,
    AgainstallOdds,
    PhalanxFighting,
    GrantCover,
    ShieldCharge,
    OnewiththeShield,
  ],
};

export default powerset;
