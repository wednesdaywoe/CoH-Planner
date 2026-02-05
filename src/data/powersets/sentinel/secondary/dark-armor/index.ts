/**
 * Dark Armor Powerset
 * Dark Armor allows you to tap into the powers of the Netherworld for protection. Some Dark Armor powers drain your foes to strengthen you. Dark Armor offers very good resistance to Negative Energy damage, and is one of the only defensive sets that offer some resistance to Psionic damage. However. its resistance to Energy is weak and it offers no protection to Knockback.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/dark_armor
 */

import type { Powerset } from '@/types';

import { DarkEmbrace as DarkEmbrace } from './dark-embrace';
import { ShadowDweller as ShadowDweller } from './shadow-dweller';
import { MurkyCloud as MurkyCloud } from './murky-cloud';
import { ObsidianShield as ObsidianShield } from './obsidian-shield';
import { DarkRegeneration as DarkRegeneration } from './dark-regeneration';
import { ObscureSustenance as ObscureSustenance } from './obscure-sustenance';
import { CloakofDarkness as CloakofDarkness } from './cloak-of-darkness';
import { CloakofFear as CloakofFear } from './cloak-of-fear';
import { OppressiveGloom as OppressiveGloom } from './oppressive-gloom';
import { SoulTransfer as SoulTransfer } from './soul-transfer';

export const powerset: Powerset = {
  id: 'sentinel/dark-armor',
  name: 'Dark Armor',
  description: 'Dark Armor allows you to tap into the powers of the Netherworld for protection. Some Dark Armor powers drain your foes to strengthen you. Dark Armor offers very good resistance to Negative Energy damage, and is one of the only defensive sets that offer some resistance to Psionic damage. However. its resistance to Energy is weak and it offers no protection to Knockback.',
  icon: 'dark_armor_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    DarkEmbrace,
    ShadowDweller,
    MurkyCloud,
    ObsidianShield,
    DarkRegeneration,
    ObscureSustenance,
    CloakofDarkness,
    CloakofFear,
    OppressiveGloom,
    SoulTransfer,
  ],
};

export default powerset;
