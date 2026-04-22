/**
 * Radiation Armor Powerset
 * Radiation emanates from your body which harms foes, but empowers and shields yourself. You can use this energy to absorb damage, heal from your wounds and debilitate nearby foes.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/radiation_armor
 */

import type { Powerset } from '@/types';

import { AlphaBarrier as AlphaBarrier } from './alpha-barrier';
import { FalloutShelter as FalloutShelter } from './fallout-shelter';
import { GammaBoost as GammaBoost } from './gamma-boost';
import { GroundZero as GroundZero } from './ground-zero';
import { Meltdown as Meltdown } from './meltdown';
import { ParticleAcceleration as ParticleAcceleration } from './particle-acceleration';
import { ParticleShielding as ParticleShielding } from './particle-shielding';
import { ProtonArmor as ProtonArmor } from './proton-armor';
import { ProtonTherapy as ProtonTherapy } from './proton-therapy';

export const powerset: Powerset = {
  id: 'sentinel/radiation-armor',
  name: 'Radiation Armor',
  description: 'Radiation emanates from your body which harms foes, but empowers and shields yourself. You can use this energy to absorb damage, heal from your wounds and debilitate nearby foes.',
  icon: 'radiation_armor_set.ico',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    AlphaBarrier,
    FalloutShelter,
    GammaBoost,
    GroundZero,
    Meltdown,
    ParticleAcceleration,
    ParticleShielding,
    ProtonArmor,
    ProtonTherapy,
  ],
};

export default powerset;
