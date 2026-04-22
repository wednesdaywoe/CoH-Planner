/**
 * Regeneration Powerset
 * Regeneration leads to powers that let you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/regeneration
 */

import type { Powerset } from '@/types';

import { SecondWind as SecondWind } from './dull-pain';
import { FastHealing as FastHealing } from './fast-healing';
import { Hide as Hide } from './hide';
import { InstantHealing as InstantHealing } from './instant-healing';
import { ReactiveRegeneration as ReactiveRegeneration } from './instant-regeneration';
import { Integration as Integration } from './integration';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';
import { Reconstruction as Reconstruction } from './reconstruction';
import { Resilience as Resilience } from './resilience';
import { AilmentResistance as AilmentResistance } from './revive';

export const powerset: Powerset = {
  id: 'stalker/regeneration',
  name: 'Regeneration',
  description: 'Regeneration leads to powers that let you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.',
  icon: 'regeneration_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    SecondWind,
    FastHealing,
    Hide,
    InstantHealing,
    ReactiveRegeneration,
    Integration,
    MomentofGlory,
    Reconstruction,
    Resilience,
    AilmentResistance,
  ],
};

export default powerset;
