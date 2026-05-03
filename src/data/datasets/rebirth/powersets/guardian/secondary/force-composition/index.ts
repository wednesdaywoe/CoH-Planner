/**
 * Force Composition Powerset
 * Mastery of Force Composition allows you to manipulate potent force fields and throw concussive blasts, shielding yourself and your allies while hampering your foes.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/force_composition
 */

import type { Powerset } from '@/types';

import { TempInvulnerability as TempInvulnerability } from './temp-invulnerability';
import { ForceBolt as ForceBolt } from './force-bolt';
import { ForceAffinity as ForceAffinity } from './force-affinity';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { ForceBarrier as ForceBarrier } from './force-barrier';
import { ContainmentShell as ContainmentShell } from './containment-shell';
import { RepulsionBomb as RepulsionBomb } from './repulsion-bomb';
import { ForceShielding as ForceShielding } from './force-skin';
import { SuppressionField as SuppressionField } from './suppression-field';

export const powerset: Powerset = {
  id: 'guardian/force-composition',
  name: 'Force Composition',
  description: 'Mastery of Force Composition allows you to manipulate potent force fields and throw concussive blasts, shielding yourself and your allies while hampering your foes.',
  icon: 'fiery_aura_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    TempInvulnerability,
    ForceBolt,
    ForceAffinity,
    DispersionBubble,
    ForceBarrier,
    ContainmentShell,
    RepulsionBomb,
    ForceShielding,
    SuppressionField,
  ],
};

export default powerset;
