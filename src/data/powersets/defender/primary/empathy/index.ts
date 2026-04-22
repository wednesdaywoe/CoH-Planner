/**
 * Empathy Powerset
 * Empathy gives you the ability to heal and aid allies as well as yourself. Empathy has no offensive powers, but its heals and buffs are unmatched.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/empathy
 */

import type { Powerset } from '@/types';

import { AbsorbPain as AbsorbPain } from './absorb-pain';
import { AdrenalinBoost as AdrenalinBoost } from './adrenalin-boost';
import { ClearMind as ClearMind } from './clear-mind';
import { Fortitude as Fortitude } from './fortitude';
import { HealOther as HealOther } from './heal-other';
import { RecoveryAura as RecoveryAura } from './recovery-aura';
import { RegenerationAura as RegenerationAura } from './regeneration-aura';
import { Resurrect as Resurrect } from './resurrect';
import { HealingAura as HealingAura } from './siphon-energy';

export const powerset: Powerset = {
  id: 'defender/empathy',
  name: 'Empathy',
  description: 'Empathy gives you the ability to heal and aid allies as well as yourself. Empathy has no offensive powers, but its heals and buffs are unmatched.',
  icon: 'empathy_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    AbsorbPain,
    AdrenalinBoost,
    ClearMind,
    Fortitude,
    HealOther,
    RecoveryAura,
    RegenerationAura,
    Resurrect,
    HealingAura,
  ],
};

export default powerset;
