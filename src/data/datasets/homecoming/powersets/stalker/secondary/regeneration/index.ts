/**
 * Regeneration Powerset
 * Regeneration leads to powers that let you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/regeneration
 */

import type { Powerset } from '@/types';

import { Hide as Hide } from './hide';
import { Reconstruction as Reconstruction } from './reconstruction';
import { FastHealing as FastHealing } from './fast-healing';
import { Revive as Revive } from './revive';
import { Integration as Integration } from './integration';
import { Resilience as Resilience } from './resilience';
import { InstantHealing as InstantHealing } from './instant-healing';
import { InstantRegeneration as InstantRegeneration } from './instant-regeneration';
import { DullPain as DullPain } from './dull-pain';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';

export const powerset: Powerset = {
  id: 'stalker/regeneration',
  internalName: 'regeneration',
  name: 'Regeneration',
  description: 'Regeneration leads to powers that let you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.',
  icon: 'regeneration_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    Reconstruction,
    FastHealing,
    Revive,
    Integration,
    Resilience,
    InstantHealing,
    InstantRegeneration,
    DullPain,
    MomentofGlory,
  ],
};

export default powerset;
