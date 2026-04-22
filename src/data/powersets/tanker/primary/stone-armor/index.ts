/**
 * Stone Armor Powerset
 * You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Tanker Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to their enormous bulk.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/stone_armor
 */

import type { Powerset } from '@/types';

import { BrimstoneArmor as BrimstoneArmor } from './brimstone-armor';
import { RockArmor as RockArmor } from './stone-armor';
import { CrystalArmor as CrystalArmor } from './crystal-armor';
import { EarthsEmbrace as EarthsEmbrace } from './earths-embrace';
import { GraniteArmor as GraniteArmor } from './granite-armor';
import { Minerals as Minerals } from './mineral-armor';
import { MudPots as MudPots } from './mud-pots';
import { Rooted as Rooted } from './rooted';
import { StoneSkin as StoneSkin } from './stone-skin';

export const powerset: Powerset = {
  id: 'tanker/stone-armor',
  name: 'Stone Armor',
  description: 'You can transform your skin into various forms of rock and stone. Stone Armor is one of the only Tanker Defensive Power Sets that offers defense to Psionics. Stone Armor offers amazing defense, but a few Stone Armors are mutually exclusive to each other. Some Armors, although offering superior defense, also slow you down due to their enormous bulk.',
  icon: 'stone_armor_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    BrimstoneArmor,
    RockArmor,
    CrystalArmor,
    EarthsEmbrace,
    GraniteArmor,
    Minerals,
    MudPots,
    Rooted,
    StoneSkin,
  ],
};

export default powerset;
