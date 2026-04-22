/**
 * Radiation Armor Powerset
 * Radiation emanates from your body which harms foes, but empowers and shields yourself. You can use this energy to absorb damage, heal from your wounds and debilitate nearby foes.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/radiation_armor
 */

import type { Powerset } from '@/types';

import { AlphaBarrier as AlphaBarrier } from './alpha-barrier';
import { BetaDecay as BetaDecay } from './beta-decay';
import { FalloutShelter as FalloutShelter } from './fallout-shelter';
import { GammaBoost as GammaBoost } from './gamma-boost';
import { GroundZero as GroundZero } from './ground-zero';
import { Meltdown as Meltdown } from './meltdown';
import { ParticleShielding as ParticleShielding } from './particle-shielding';
import { ProtonArmor as ProtonArmor } from './proton-armor';
import { RadiationTherapy as RadiationTherapy } from './radiation-therapy';

export const powerset: Powerset = {
  id: 'brute/radiation-armor',
  name: 'Radiation Armor',
  description: 'Radiation emanates from your body which harms foes, but empowers and shields yourself. You can use this energy to absorb damage, heal from your wounds and debilitate nearby foes.',
  icon: 'radiation_armor_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    AlphaBarrier,
    BetaDecay,
    FalloutShelter,
    GammaBoost,
    GroundZero,
    Meltdown,
    ParticleShielding,
    ProtonArmor,
    RadiationTherapy,
  ],
};

export default powerset;
