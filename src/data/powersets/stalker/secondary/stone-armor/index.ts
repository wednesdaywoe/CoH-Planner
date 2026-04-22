/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Stalker Defensive Power Sets that offers defense to Psionics.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { RockArmor as RockArmor } from './stone-armor';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { EarthsEmbrace as EarthsEmbrace } from './earths-embrace';
import { Geode as Geode } from './geode';
import { Hide as Hide } from './hide';
import { Minerals as Minerals } from './mineral-armor';
import { Rooted as Rooted } from './rooted';
import { StoneSkin as StoneSkin } from './stone-skin';

export const powerset: Powerset = {
  id: 'stalker/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Stalker Defensive Power Sets that offers defense to Psionics.',
  icon: 'stone_armor_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    BrimstoneArmor,
    RockArmor,
    CrystalArmor,
    EarthsEmbrace,
    Geode,
    Hide,
    Minerals,
    Rooted,
    StoneSkin,
  ],
};

export default powerset;
