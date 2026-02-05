/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Scrapper Defensive Power Sets that offers defense to Psionics.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { RockArmor as RockArmor } from './rock-armor';
import { StoneSkin as StoneSkin } from './stone-skin';
import { EarthsEmbrace as EarthsEmbrace } from './earth-s-embrace';
import { MudPots as MudPots } from './mud-pots';
import { Rooted as Rooted } from './rooted';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { Minerals as Minerals } from './minerals';
import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { Geode as Geode } from './geode';

export const powerset: Powerset = {
  id: 'scrapper/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Scrapper Defensive Power Sets that offers defense to Psionics.',
  icon: 'stone_armor_set.png',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    RockArmor,
    StoneSkin,
    EarthsEmbrace,
    MudPots,
    Rooted,
    CrystalArmor,
    Minerals,
    BrimstoneArmor,
    Geode,
  ],
};

export default powerset;
