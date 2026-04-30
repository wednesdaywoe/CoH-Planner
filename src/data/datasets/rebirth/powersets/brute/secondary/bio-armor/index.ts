/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment.  You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form.  Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: brute
 * Category: secondary
 * Source: brute_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { EnvironmentalModification as EnvironmentalModification } from './environmental-adaptation';
import { EvolvingArmor as EvolvingArmor } from './evolution';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { Adaptation as Adaptation } from './adaptation';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticContamination as GeneticContamination } from './genetic-contamination';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';
import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';

export const powerset: Powerset = {
  id: 'brute/bio-armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment.  You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form.  Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.ico',
  archetype: 'brute',
  category: 'secondary',
  powers: [
    HardenedCarapace,
    Inexhaustible,
    EnvironmentalModification,
    EvolvingArmor,
    AblativeCarapace,
    Adaptation,
    DNASiphon,
    GeneticContamination,
    ParasiticAura,
    EfficientAdaptation,
    DefensiveAdaptation,
    OffensiveAdaptation,
  ],
};

export default powerset;
