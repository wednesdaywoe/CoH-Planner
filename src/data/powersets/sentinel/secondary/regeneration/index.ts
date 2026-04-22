/**
 * Regeneration Powerset
 * Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/regeneration
 */

import type { Powerset } from '@/types';

import { AilmentResistance as AilmentResistance } from './dismiss-pain';
import { FastHealing as FastHealing } from './fast-healing';
import { ReactiveRegeneration as ReactiveRegeneration } from './instant-regeneration';
import { Integration as Integration } from './integration';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { Reconstruction as Reconstruction } from './reconstruction';
import { Resilience as Resilience } from './resilience';
import { SecondWind as SecondWind } from './second-wind';

export const powerset: Powerset = {
  id: 'sentinel/regeneration',
  name: 'Regeneration',
  description: 'Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.',
  icon: 'regeneration_set.ico',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    AilmentResistance,
    FastHealing,
    ReactiveRegeneration,
    Integration,
    MomentofGlory,
    QuickRecovery,
    Reconstruction,
    Resilience,
    SecondWind,
  ],
};

export default powerset;
