/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Stalker Defensive Power Sets that offers defense to Psionics.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { Hide as Hide } from './hide';
import { RockArmor as RockArmor } from './rock-armor';
import { StoneSkin as StoneSkin } from './stone-skin';
import { EarthsEmbrace as EarthsEmbrace } from './earth-s-embrace';
import { Rooted as Rooted } from './rooted';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { Minerals as Minerals } from './minerals';
import { Geode as Geode } from './geode';

export const powerset: Powerset = {
  id: 'stalker/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Stalker Defensive Power Sets that offers defense to Psionics.',
  icon: 'stone_armor_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    RockArmor,
    StoneSkin,
    EarthsEmbrace,
    Rooted,
    CrystalArmor,
    BrimstoneArmor,
    Minerals,
    Geode,
  ],
};

export default powerset;
