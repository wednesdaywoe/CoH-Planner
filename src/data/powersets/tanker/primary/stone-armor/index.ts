/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Tanker Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to their enormous bulk.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/stone_armor
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
import { GraniteArmor as GraniteArmor } from './granite-armor';

export const powerset: Powerset = {
  id: 'tanker/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Tanker Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to their enormous bulk.',
  icon: 'stone_armor_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    RockArmor,
    StoneSkin,
    EarthsEmbrace,
    MudPots,
    Rooted,
    CrystalArmor,
    Minerals,
    BrimstoneArmor,
    GraniteArmor,
  ],
};

export default powerset;
