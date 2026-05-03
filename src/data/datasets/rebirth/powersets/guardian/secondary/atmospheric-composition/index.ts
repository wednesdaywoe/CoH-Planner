/**
 * Atmospheric Composition Powerset
 * Atmospheric Composition users can harness the wind, weather, and lightning to wreak havoc on their foes and protect themselves and their allies.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/atmospheric_composition
 */

import type { Powerset } from '@/types';

import { ChargedArmor as ChargedArmor } from './charged-armor';
import { GaleWinds as GaleWinds } from './gale-winds';
import { GroundingShield as GroundingShield } from './grounding-shield';
import { StaticShield as StaticShield } from './static-shield';
import { SteamyMist as SteamyMist } from './steamy-mist';
import { MassEnergize as MassEnergize } from './mass-energize';
import { SnowStorm as SnowStorm } from './snow-storm';
import { PowerSink as PowerSink } from './power-sink';
import { FreezingRain as FreezingRain } from './freezing-rain';

export const powerset: Powerset = {
  id: 'guardian/atmospheric-composition',
  name: 'Atmospheric Composition',
  description: 'Atmospheric Composition users can harness the wind, weather, and lightning to wreak havoc on their foes and protect themselves and their allies.',
  icon: 'electric_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    ChargedArmor,
    GaleWinds,
    GroundingShield,
    StaticShield,
    SteamyMist,
    MassEnergize,
    SnowStorm,
    PowerSink,
    FreezingRain,
  ],
};

export default powerset;
