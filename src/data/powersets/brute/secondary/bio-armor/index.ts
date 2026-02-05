/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';
import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { EvolvingArmor as EvolvingArmor } from './evolving-armor';
import { EnvironmentalModification as EnvironmentalModification } from './environmental-modification';
import { Adaptation as Adaptation } from './adaptation';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticContamination as GeneticContamination } from './genetic-contamination';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';

export const powerset: Powerset = {
  id: 'brute/bio-armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.png',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    DefensiveAdaptation,
    EfficientAdaptation,
    OffensiveAdaptation,
    HardenedCarapace,
    Inexhaustible,
    EvolvingArmor,
    EnvironmentalModification,
    Adaptation,
    AblativeCarapace,
    DNASiphon,
    GeneticContamination,
    ParasiticAura,
  ],
};

export default powerset;
