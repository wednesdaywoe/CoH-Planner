/**
 * Regeneration Powerset
 * Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/regeneration
 */

import type { Powerset } from '@/types';

import { SecondWind as SecondWind } from './dull-pain';
import { FastHealing as FastHealing } from './fast-healing';
import { ReactiveRegeneration as ReactiveRegeneration } from './instant-healing';
import { Integration as Integration } from './integration';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { Reconstruction as Reconstruction } from './reconstruction';
import { Resilience as Resilience } from './resist-disorientation';
import { AilmentResistance as AilmentResistance } from './revive';

export const powerset: Powerset = {
  id: 'tanker/regeneration',
  name: 'Regeneration',
  description: 'Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.',
  icon: 'regeneration_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    SecondWind,
    FastHealing,
    ReactiveRegeneration,
    Integration,
    MomentofGlory,
    QuickRecovery,
    Reconstruction,
    Resilience,
    AilmentResistance,
  ],
};

export default powerset;
