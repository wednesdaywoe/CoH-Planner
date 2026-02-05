/**
 * Necromancy Powerset
 * Command the forces of Death. Necromancy allows you to summon undead henchmen to do your bidding. Some Necromancy powers can even grant your undead henchmen additional powers. Most Undead Henchmen generally have good resistances to Cold, Negative Energy, and Psionic damage as well as Sleep, Fear and Disorient. Undead Henchman cannot be resurrected.
 *
 * Archetype: mastermind
 * Category: primary
 * Source: mastermind_summon/necromancy
 */

import type { Powerset } from '@/types';

import { DarkBlast as DarkBlast } from './dark-blast';
import { ZombieHorde as ZombieHorde } from './zombie-horde';
import { Gloom as Gloom } from './gloom';
import { EnchantUndead as EnchantUndead } from './enchant-undead';
import { LifeDrain as LifeDrain } from './life-drain';
import { GraveKnight as GraveKnight } from './grave-knight';
import { SoulExtraction as SoulExtraction } from './soul-extraction';
import { Lich as Lich } from './lich';
import { DarkEmpowerment as DarkEmpowerment } from './dark-empowerment';

export const powerset: Powerset = {
  id: 'mastermind/necromancy',
  name: 'Necromancy',
  description: 'Command the forces of Death. Necromancy allows you to summon undead henchmen to do your bidding. Some Necromancy powers can even grant your undead henchmen additional powers. Most Undead Henchmen generally have good resistances to Cold, Negative Energy, and Psionic damage as well as Sleep, Fear and Disorient. Undead Henchman cannot be resurrected.',
  icon: 'necromancy_set.png',
  archetype: 'mastermind',
  category: 'primary',
  powers: [
    DarkBlast,
    ZombieHorde,
    Gloom,
    EnchantUndead,
    LifeDrain,
    GraveKnight,
    SoulExtraction,
    Lich,
    DarkEmpowerment,
  ],
};

export default powerset;
