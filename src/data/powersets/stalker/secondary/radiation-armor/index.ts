/**
 * Radiation Armor Powerset
 * Radiation emanates from your body which harms foes, but empowers and shields yourself. You can use this energy to absorb damage, heal from your wounds and debilitate nearby foes.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/radiation_armor
 */

import type { Powerset } from '@/types';

import { AlphaBarrier as AlphaBarrier } from './alpha-barrier';
import { Hide as Hide } from './hide';
import { GammaBoost as GammaBoost } from './gamma-boost';
import { ProtonArmor as ProtonArmor } from './proton-armor';
import { FalloutShelter as FalloutShelter } from './fallout-shelter';
import { RadiationTherapy as RadiationTherapy } from './radiation-therapy';
import { ParticleShielding as ParticleShielding } from './particle-shielding';
import { GroundZero as GroundZero } from './ground-zero';
import { Meltdown as Meltdown } from './meltdown';

export const powerset: Powerset = {
  id: 'stalker/radiation-armor',
  name: 'Radiation Armor',
  description: 'Radiation emanates from your body which harms foes, but empowers and shields yourself. You can use this energy to absorb damage, heal from your wounds and debilitate nearby foes.',
  icon: 'radiation_armor_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    AlphaBarrier,
    Hide,
    GammaBoost,
    ProtonArmor,
    FalloutShelter,
    RadiationTherapy,
    ParticleShielding,
    GroundZero,
    Meltdown,
  ],
};

export default powerset;
