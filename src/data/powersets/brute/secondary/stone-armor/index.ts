/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Brute Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to their enormous bulk.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { EarthsEmbrace as EarthsEmbrace } from './earths-embrace';
import { GraniteArmor as GraniteArmor } from './granite-armor';
import { Minerals as Minerals } from './minerals';
import { MudPots as MudPots } from './mud-pots';
import { RockArmor as RockArmor } from './rock-armor';
import { Rooted as Rooted } from './rooted';
import { StoneSkin as StoneSkin } from './stone-skin';

export const powerset: Powerset = {
  id: 'brute/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Brute Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to their enormous bulk.',
  icon: 'stone_armor_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    BrimstoneArmor,
    CrystalArmor,
    EarthsEmbrace,
    GraniteArmor,
    Minerals,
    MudPots,
    RockArmor,
    Rooted,
    StoneSkin,
  ],
};

export default powerset;
