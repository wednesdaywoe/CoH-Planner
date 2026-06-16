/**
 * Nature Armor Powerset
 * Channel the ambient power hidden in the natural life around you to defend yourself and your allies.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/sacred_armor
 */

import type { Powerset } from '@/types';

import { Grace as Grace } from './grace';
import { WildArmor as WildArmor } from './wild-armor';
import { GuidingLight as GuidingLight } from './guiding-light';
import { Allseer as Allseer } from './allseer';
import { LashingLife as LashingLife } from './lashing-life';
import { Geomancy as Geomancy } from './geomancy';
import { TremblingEarth as TremblingEarth } from './trembling-earth';
import { PrimalForce as PrimalForce } from './primal-force';
import { OneWithAll as OneWithAll } from './one-with-all';
import { GeomancyRootBonus as GeomancyRootBonus } from './geomancy-root-bonus';
import { GuidingLightRootBonus as GuidingLightRootBonus } from './guiding-light-root-bonus';

export const powerset: Powerset = {
  id: 'tanker/nature-armor',
  name: 'Nature Armor',
  description: 'Channel the ambient power hidden in the natural life around you to defend yourself and your allies.',
  icon: 'dark_armor_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    Grace,
    WildArmor,
    GuidingLight,
    Allseer,
    LashingLife,
    Geomancy,
    TremblingEarth,
    PrimalForce,
    OneWithAll,
    GeomancyRootBonus,
    GuidingLightRootBonus,
  ],
};

export default powerset;
