/**
 * Ninja Assault Powerset
 * Your mastery of the ways of Ninja Assault allows you to dispatch opponents with lethal grace, cutting down foes with the razor edge of your Ninja Blade and delivering death from afar with throwing knives. Your attacks often carry additional poison damage over time, and can also knock opponents down or reduce their defense.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/ninja_assault
 */

import type { Powerset } from '@/types';

import { FlashingBlade as FlashingBlade } from './flashing-blade';
import { GamblersCut as GamblersCut } from './gamblers-cut';
import { SteelWind as SteelWind } from './steel-wind';
import { SoaringDragon as SoaringDragon } from './soaring-dragon';
import { ChiStrike as ChiStrike } from './chi-strike';
import { ScorpionsSting as ScorpionsSting } from './scorpions-sting';
import { TheLotusDrops as TheLotusDrops } from './the-lotus-drops';
import { Caltrops as Caltrops } from './caltrops';
import { GoldenDragonfly as GoldenDragonfly } from './golden-dragonfly';

export const powerset: Powerset = {
  id: 'guardian/ninja-assault',
  name: 'Ninja Assault',
  description: 'Your mastery of the ways of Ninja Assault allows you to dispatch opponents with lethal grace, cutting down foes with the razor edge of your Ninja Blade and delivering death from afar with throwing knives. Your attacks often carry additional poison damage over time, and can also knock opponents down or reduce their defense.',
  icon: 'ninja_sword_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    FlashingBlade,
    GamblersCut,
    SteelWind,
    SoaringDragon,
    ChiStrike,
    ScorpionsSting,
    TheLotusDrops,
    Caltrops,
    GoldenDragonfly,
  ],
};

export default powerset;
