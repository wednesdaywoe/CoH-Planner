/**
 * Regeneration Powerset
 * Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/regeneration
 */

import type { Powerset } from '@/types';

import { FastHealing as FastHealing } from './fast-healing';
import { Reconstruction as Reconstruction } from './reconstruction';
import { QuickRecovery as QuickRecovery } from './quick-recovery';
import { Revive as Revive } from './revive';
import { Integration as Integration } from './integration';
import { ResistDisorientation as ResistDisorientation } from './resist-disorientation';
import { InstantHealing as InstantHealing } from './instant-healing';
import { InstantRegeneration as InstantRegeneration } from './instant-regeneration';
import { DullPain as DullPain } from './dull-pain';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';

export const powerset: Powerset = {
  id: 'scrapper/regeneration',
  setPath: 'Scrapper_Defense.Regeneration',
  name: 'Regeneration',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Regeneration lets you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.",
  icon: 'regeneration_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    FastHealing,
    Reconstruction,
    QuickRecovery,
    Revive,
    Integration,
    ResistDisorientation,
    InstantHealing,
    InstantRegeneration,
    DullPain,
    MomentofGlory,
  ],
};

export default powerset;
