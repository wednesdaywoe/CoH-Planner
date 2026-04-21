/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { Adaptation as Adaptation } from './adaptation';
import { EnvironmentalModification as EnvironmentalModification } from './environmental-adaptation';
import { EvolvingArmor as EvolvingArmor } from './evolution';
import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticContamination as GeneticContamination } from './genetic-contamination';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';

export const powerset: Powerset = {
  id: 'tanker/bio-armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.png',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    HardenedCarapace,
    Inexhaustible,
    Adaptation,
    EnvironmentalModification,
    EvolvingArmor,
    EfficientAdaptation,
    DefensiveAdaptation,
    OffensiveAdaptation,
    AblativeCarapace,
    DNASiphon,
    GeneticContamination,
    ParasiticAura,
  ],
};

export default powerset;
