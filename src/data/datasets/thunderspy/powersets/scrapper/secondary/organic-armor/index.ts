/**
 * Organic Armor Powerset
 * An advanced variant of Bio Armor, Organic Armor provides very similar capabilities as Bio Armor, but its adaptations are more varied.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/organic_armor
 */

import type { Powerset } from '@/types';

import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';
import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { EnvironmentalAdaptation as EnvironmentalAdaptation } from './environmental-adaptation';
import { Evolution as Evolution } from './evolution';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { Adaptation as Adaptation } from './adaptation';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticContamination as GeneticContamination } from './genetic-contamination';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';

export const powerset: Powerset = {
  id: 'scrapper/organic-armor',
  setPath: 'Scrapper_Defense.Organic_Armor',
  name: 'Organic Armor',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "An advanced variant of Bio Armor, Organic Armor provides very similar capabilities as Bio Armor, but its adaptations are more varied.",
  icon: 'bio_organic_armor_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
  powers: [
    EfficientAdaptation,
    DefensiveAdaptation,
    OffensiveAdaptation,
    HardenedCarapace,
    Inexhaustible,
    EnvironmentalAdaptation,
    Evolution,
    AblativeCarapace,
    Adaptation,
    DNASiphon,
    GeneticContamination,
    ParasiticAura,
  ],
};

export default powerset;
