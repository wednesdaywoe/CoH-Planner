/**
 * Regeneration Powerset
 * Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/regeneration
 */

import type { Powerset } from '@/types';

import { FastHealing as FastHealing } from './fast-healing';
import { Reconstruction as Reconstruction } from './reconstruction';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { AilmentResistance as AilmentResistance } from './ailment-resistance';
import { Integration as Integration } from './integration';
import { Resilience as Resilience } from './resilience';
import { ReactiveRegeneration as ReactiveRegeneration } from './reactive-regeneration';
import { SecondWind as SecondWind } from './second-wind';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';

export const powerset: Powerset = {
  id: 'sentinel/regeneration',
  name: 'Regeneration',
  description: 'Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.',
  icon: 'regeneration_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    FastHealing,
    Reconstruction,
    QuickRecovery,
    AilmentResistance,
    Integration,
    Resilience,
    ReactiveRegeneration,
    SecondWind,
    MomentofGlory,
  ],
};

export default powerset;
