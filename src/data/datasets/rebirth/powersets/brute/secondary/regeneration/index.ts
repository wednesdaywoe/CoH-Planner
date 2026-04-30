/**
 * Regeneration Powerset
 * Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly.  Those who possess this power set have little downtime.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/regeneration
 */

import type { Powerset } from '@/types';

import { FastHealing as FastHealing } from './fast-healing';
import { Reconstruction as Reconstruction } from './reconstruction';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { DullPain as DullPain } from './dull-pain';
import { Integration as Integration } from './integration';
import { Resilience as Resilience } from './resist-disorientation';
import { InstantHealing as InstantHealing } from './instant-healing';
import { Revive as Revive } from './revive';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';

export const powerset: Powerset = {
  id: 'brute/regeneration',
  name: 'Regeneration',
  description: 'Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly.  Those who possess this power set have little downtime.',
  icon: 'regeneration_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    FastHealing,
    Reconstruction,
    QuickRecovery,
    DullPain,
    Integration,
    Resilience,
    InstantHealing,
    Revive,
    MomentofGlory,
  ],
};

export default powerset;
