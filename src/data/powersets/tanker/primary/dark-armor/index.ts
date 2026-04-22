/**
 * Dark Armor Powerset
 * Dark Armor allows you to tap into the powers of the Netherworld for protection. Many Dark Armor powers drain your foes to strengthen you. Dark Armor offers very good resistance to Negative Energy damage, and is one of the only defensive sets that offer some resistance to Psionic damage. However, its resistance to Energy is weak and it offers no protection from Knockback or Immobilization.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/dark_armor
 */

import type { Powerset } from '@/types';

import { CloakofDarkness as CloakofDarkness } from './cloak-of-darkness';
import { CloakofFear as CloakofFear } from './cloak-of-fear';
import { DarkEmbrace as DarkEmbrace } from './dark-embrace';
import { DarkRegeneration as DarkRegeneration } from './dark-regeneration';
import { DeathShroud as DeathShroud } from './death-shroud';
import { MurkyCloud as MurkyCloud } from './murky-cloud';
import { ObscureSustenance as ObscureSustenance } from './obscure-sustenance';
import { ObsidianShield as ObsidianShield } from './obsidian-shield';
import { OppressiveGloom as OppressiveGloom } from './oppressive-gloom';
import { SoulTransfer as SoulTransfer } from './soul-transfer';

export const powerset: Powerset = {
  id: 'tanker/dark-armor',
  name: 'Dark Armor',
  description: 'Dark Armor allows you to tap into the powers of the Netherworld for protection. Many Dark Armor powers drain your foes to strengthen you. Dark Armor offers very good resistance to Negative Energy damage, and is one of the only defensive sets that offer some resistance to Psionic damage. However, its resistance to Energy is weak and it offers no protection from Knockback or Immobilization.',
  icon: 'dark_armor_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    CloakofDarkness,
    CloakofFear,
    DarkEmbrace,
    DarkRegeneration,
    DeathShroud,
    MurkyCloud,
    ObscureSustenance,
    ObsidianShield,
    OppressiveGloom,
    SoulTransfer,
  ],
};

export default powerset;
