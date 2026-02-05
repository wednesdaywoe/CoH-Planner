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
import { AilmentResistance as AilmentResistance } from './ailment-resistance';
import { Integration as Integration } from './integration';
import { Resilience as Resilience } from './resilience';
import { InstantHealing as InstantHealing } from './instant-healing';
import { ReactiveRegeneration as ReactiveRegeneration } from './reactive-regeneration';
import { SecondWind as SecondWind } from './second-wind';
import { MomentofGlory as MomentofGlory } from './moment-of-glory';

export const powerset: Powerset = {
  id: 'stalker/regeneration',
  name: 'Regeneration',
  description: 'Regeneration leads to powers that let you regenerate more quickly from damage and effects. Regeneration offers almost no actual damage resistance, but your Hit Point Regeneration can become so incredibly fast, that your wounds heal almost instantly. Those who possess this power set have little downtime.',
  icon: 'regeneration_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    Reconstruction,
    FastHealing,
    AilmentResistance,
    Integration,
    Resilience,
    InstantHealing,
    ReactiveRegeneration,
    SecondWind,
    MomentofGlory,
  ],
};

export default powerset;
