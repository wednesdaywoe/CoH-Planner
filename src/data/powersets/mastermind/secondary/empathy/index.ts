/**
 * Empathy Powerset
 * Empathy gives you the ability to heal and aid allies as well as yourself. Empathy has no offensive powers, but its heals and buffs are unmatched.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/empathy
 */

import type { Powerset } from '@/types';

import { HealOther as HealOther } from './heal-other';
import { HealingAura as HealingAura } from './healing-aura';
import { AbsorbPain as AbsorbPain } from './absorb-pain';
import { Resurrect as Resurrect } from './resurrect';
import { ClearMind as ClearMind } from './clear-mind';
import { Fortitude as Fortitude } from './fortitude';
import { RecoveryAura as RecoveryAura } from './recovery-aura';
import { RegenerationAura as RegenerationAura } from './regeneration-aura';
import { AdrenalinBoost as AdrenalinBoost } from './adrenalin-boost';

export const powerset: Powerset = {
  id: 'mastermind/empathy',
  name: 'Empathy',
  description: 'Empathy gives you the ability to heal and aid allies as well as yourself. Empathy has no offensive powers, but its heals and buffs are unmatched.',
  icon: 'empathy_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    HealOther,
    HealingAura,
    AbsorbPain,
    Resurrect,
    ClearMind,
    Fortitude,
    RecoveryAura,
    RegenerationAura,
    AdrenalinBoost,
  ],
};

export default powerset;
