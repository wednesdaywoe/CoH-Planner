/**
 * Empathy Powerset
 * Empathy gives you the ability to heal and aid allies as well as yourself.  Empathy has no offensive powers, but its heals and buffs are unmatched.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/empathy
 */

import type { Powerset } from '@/types';

import { SiphonEnergy as SiphonEnergy } from './siphon-energy';
import { HealOther as HealOther } from './heal-other';
import { HealingRay as HealingRay } from './healing-ray';
import { ClearMind as ClearMind } from './clear-mind';
import { Fortitude as Fortitude } from './fortitude';
import { Resurrect as Resurrect } from './resurrect';
import { AbsorbPain as AbsorbPain } from './absorb-pain';
import { RegenerationAura as RegenerationAura } from './regeneration-aura';
import { AdrenalinBoost as AdrenalinBoost } from './adrenalin-boost';

export const powerset: Powerset = {
  id: 'controller/empathy',
  setPath: 'Controller_Buff.Empathy',
  name: 'Empathy',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Empathy gives you the ability to heal and aid allies as well as yourself.  Empathy has no offensive powers, but its heals and buffs are unmatched.',
  icon: 'empathy_set.ico',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    SiphonEnergy,
    HealOther,
    HealingRay,
    ClearMind,
    Fortitude,
    Resurrect,
    AbsorbPain,
    RegenerationAura,
    AdrenalinBoost,
  ],
};

export default powerset;
