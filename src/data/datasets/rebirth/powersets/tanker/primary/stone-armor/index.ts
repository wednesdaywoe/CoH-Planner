/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Tanker Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing Defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to its enormous bulk.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { StoneArmor as StoneArmor } from './stone-armor';
import { StoneSkin as StoneSkin } from './stone-skin';
import { EarthsEmbrace as EarthsEmbrace } from './earths-embrace';
import { MudPots as MudPots } from './mud-pots';
import { Rooted as Rooted } from './rooted';
import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { MineralArmor as MineralArmor } from './mineral-armor';
import { GraniteArmor as GraniteArmor } from './granite-armor';

export const powerset: Powerset = {
  id: 'tanker/stone-armor',
  setPath: 'Tanker_Defense.Stone_Armor',
  name: 'Stone Armor',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Tanker Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing Defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to its enormous bulk.',
  icon: 'stone_armor_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    StoneArmor,
    StoneSkin,
    EarthsEmbrace,
    MudPots,
    Rooted,
    BrimstoneArmor,
    CrystalArmor,
    MineralArmor,
    GraniteArmor,
  ],
};

export default powerset;
