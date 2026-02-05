/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Sentinel Defensive Power Sets that offers defense to Psionics.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { RockArmor as RockArmor } from './rock-armor';
import { StoneSkin as StoneSkin } from './stone-skin';
import { EarthsEmbrace as EarthsEmbrace } from './earth-s-embrace';
import { TerraFirma as TerraFirma } from './terra-firma';
import { Rooted as Rooted } from './rooted';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { Minerals as Minerals } from './minerals';
import { Geode as Geode } from './geode';

export const powerset: Powerset = {
  id: 'sentinel/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the few Sentinel Defensive Power Sets that offers defense to Psionics.',
  icon: 'stone_armor_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    RockArmor,
    StoneSkin,
    EarthsEmbrace,
    TerraFirma,
    Rooted,
    CrystalArmor,
    BrimstoneArmor,
    Minerals,
    Geode,
  ],
};

export default powerset;
