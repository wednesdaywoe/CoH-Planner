/**
 * Radiation Composition Powerset
 * Radiation Composition powers emanate from your body, empowering and shielding you from harm.  This energy allows you to manipulate atomic particles and waves to protect your allies and weaken your enemies.  You abilities also allow you to heal from your wounds and even absorb damage.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/radiation_composition
 */

import type { Powerset } from '@/types';

import { AlphaBarrier as AlphaBarrier } from './alpha-barrier';
import { RadiantAura as RadiantAura } from './radiant-aura';
import { ProtonArmor as ProtonArmor } from './proton-armor';
import { FalloutShelter as FalloutShelter } from './fallout-shelter';
import { AccelerateMetabolism as AccelerateMetabolism } from './accelerate-metabolism';
import { EnervatingField as EnervatingField } from './enervating-field';
import { ParticleShielding as ParticleShielding } from './particle-shielding';
import { GroundZero as GroundZero } from './ground-zero';
import { EMWave as EMWave } from './em-wave';

export const powerset: Powerset = {
  id: 'guardian/radiation-composition',
  name: 'Radiation Composition',
  description: 'Radiation Composition powers emanate from your body, empowering and shielding you from harm.  This energy allows you to manipulate atomic particles and waves to protect your allies and weaken your enemies.  You abilities also allow you to heal from your wounds and even absorb damage.',
  icon: 'radiation_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    AlphaBarrier,
    RadiantAura,
    ProtonArmor,
    FalloutShelter,
    AccelerateMetabolism,
    EnervatingField,
    ParticleShielding,
    GroundZero,
    EMWave,
  ],
};

export default powerset;
