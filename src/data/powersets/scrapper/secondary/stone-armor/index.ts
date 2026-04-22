/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Scrapper Defensive Power Sets that offers defense to Psionics.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { RockArmor as RockArmor } from './stone-armor';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { EarthsEmbrace as EarthsEmbrace } from './earths-embrace';
import { Geode as Geode } from './geode';
import { Minerals as Minerals } from './mineral-armor';
import { MudPots as MudPots } from './mud-pots';
import { Rooted as Rooted } from './rooted';
import { StoneSkin as StoneSkin } from './stone-skin';

export const powerset: Powerset = {
  id: 'scrapper/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Scrapper Defensive Power Sets that offers defense to Psionics.',
  icon: 'stone_armor_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    BrimstoneArmor,
    RockArmor,
    CrystalArmor,
    EarthsEmbrace,
    Geode,
    Minerals,
    MudPots,
    Rooted,
    StoneSkin,
  ],
};

export default powerset;
