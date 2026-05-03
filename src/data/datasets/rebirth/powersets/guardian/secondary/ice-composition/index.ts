/**
 * Ice Composition Powerset
 * Ice Composition users have mastered chilling themselves and the air around them to protect their allies, protect themselves, and weaken adversaries.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/ice_composition
 */

import type { Powerset } from '@/types';

import { FrostArmor as FrostArmor } from './frost-armor';
import { Infrigidate as Infrigidate } from './infrigidate';
import { IcePack as IcePack } from './ice-pack';
import { WetIce as WetIce } from './wet-ice';
import { GlacialArmor as GlacialArmor } from './glacial-armor';
import { ArcticFog as ArcticFog } from './arctic-fog';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { Sleet as Sleet } from './sleet';
import { HeatLoss as HeatLoss } from './heat-loss';

export const powerset: Powerset = {
  id: 'guardian/ice-composition',
  name: 'Ice Composition',
  description: 'Ice Composition users have mastered chilling themselves and the air around them to protect their allies, protect themselves, and weaken adversaries.',
  icon: 'ice_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    FrostArmor,
    Infrigidate,
    IcePack,
    WetIce,
    GlacialArmor,
    ArcticFog,
    ChillingEmbrace,
    Sleet,
    HeatLoss,
  ],
};

export default powerset;
