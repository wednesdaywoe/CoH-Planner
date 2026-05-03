/**
 * Dark Composition Powerset
 * Dark Composition wielders focus the dark energies of the Netherworld to protect themselves and weaken their foes.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/dark_composition
 */

import type { Powerset } from '@/types';

import { DarkEmbrace as DarkEmbrace } from './dark-embrace';
import { TwilightGrasp as TwilightGrasp } from './twilight-grasp';
import { TarPatch as TarPatch } from './tar-patch';
import { ObsidianShield as ObsidianShield } from './obsidian-shield';
import { MurkyHaze as MurkyHaze } from './murky-haze';
import { ShadowFall as ShadowFall } from './shadow-fall';
import { CloakofFear as CloakofFear } from './cloak-of-fear';
import { SoulAbsorption as SoulAbsorption } from './soul-absorption';
import { HowlingTwilight as HowlingTwilight } from './howling-twilight';

export const powerset: Powerset = {
  id: 'guardian/dark-composition',
  name: 'Dark Composition',
  description: 'Dark Composition wielders focus the dark energies of the Netherworld to protect themselves and weaken their foes.',
  icon: 'dark_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    DarkEmbrace,
    TwilightGrasp,
    TarPatch,
    ObsidianShield,
    MurkyHaze,
    ShadowFall,
    CloakofFear,
    SoulAbsorption,
    HowlingTwilight,
  ],
};

export default powerset;
