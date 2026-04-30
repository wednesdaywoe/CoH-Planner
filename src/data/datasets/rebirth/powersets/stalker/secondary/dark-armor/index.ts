/**
 * Dark Armor Powerset
 * Dark Armor allows you to tap into the powers of the Netherworld for protection.  Some Dark Armor powers drain your foes to strengthen you.  Dark Armor offers very good resistance to Negative Energy damage, and is one of the only defensive sets that offer some resistance to Psionic damage.  However. its resistance to Energy is weak and it offers no protection to Knockback.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/dark_armor
 */

import type { Powerset } from '@/types';

import { Hide as Hide } from './hide';
import { DarkEmbrace as DarkEmbrace } from './dark-embrace';
import { MurkyCloud as MurkyCloud } from './murky-cloud';
import { ShadowDweller as ShadowDweller } from './shadow-dweller';
import { ObsidianShield as ObsidianShield } from './obsidian-shield';
import { DarkRegeneration as DarkRegeneration } from './dark-regeneration';
import { CloakofFear as CloakofFear } from './cloak-of-fear';
import { OppressiveGloom as OppressiveGloom } from './oppressive-gloom';
import { SoulTransfer as SoulTransfer } from './soul-transfer';

export const powerset: Powerset = {
  id: 'stalker/dark-armor',
  name: 'Dark Armor',
  description: 'Dark Armor allows you to tap into the powers of the Netherworld for protection.  Some Dark Armor powers drain your foes to strengthen you.  Dark Armor offers very good resistance to Negative Energy damage, and is one of the only defensive sets that offer some resistance to Psionic damage.  However. its resistance to Energy is weak and it offers no protection to Knockback.',
  icon: 'dark_armor_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    Hide,
    DarkEmbrace,
    MurkyCloud,
    ShadowDweller,
    ObsidianShield,
    DarkRegeneration,
    CloakofFear,
    OppressiveGloom,
    SoulTransfer,
  ],
};

export default powerset;
