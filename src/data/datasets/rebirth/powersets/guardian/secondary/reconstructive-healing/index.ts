/**
 * Reconstructive Healing Powerset
 * Reconstructive Healing lets you regenerate more quickly from damage and effects. Your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly.  Reconstructive Healing gives you the ability to heal and aid allies as well.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/reconstructive_healing
 */

import type { Powerset } from '@/types';

import { Resilience as Resilience } from './resilience';
import { HealingAura as HealingAura } from './healing-aura';
import { PainAbsorption as PainAbsorption } from './pain-absorption';
import { DullPain as DullPain } from './dull-pain';
import { Integration as Integration } from './integration';
import { RecoveryAura as RecoveryAura } from './recovery-aura';
import { RegenerationAura as RegenerationAura } from './regeneration-aura';
import { Revive as Revive } from './revive';
import { FortitudeAura as FortitudeAura } from './fortitude-aura';

export const powerset: Powerset = {
  id: 'guardian/reconstructive-healing',
  name: 'Reconstructive Healing',
  description: 'Reconstructive Healing lets you regenerate more quickly from damage and effects. Your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly.  Reconstructive Healing gives you the ability to heal and aid allies as well.',
  icon: 'regeneration_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    Resilience,
    HealingAura,
    PainAbsorption,
    DullPain,
    Integration,
    RecoveryAura,
    RegenerationAura,
    Revive,
    FortitudeAura,
  ],
};

export default powerset;
