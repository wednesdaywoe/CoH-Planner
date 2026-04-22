/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Hide as Hide } from './hide';
import { BoundlessEnergy as BoundlessEnergy } from './boundless-energy';
import { EnvironmentalModification as EnvironmentalModification } from './environmental-adaptation';
import { Adaptation as Adaptation } from './adaptation';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticCorruption as GeneticCorruption } from './genetic-corruption';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';
import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';

export const powerset: Powerset = {
  id: 'stalker/bio-armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    HardenedCarapace,
    Hide,
    BoundlessEnergy,
    EnvironmentalModification,
    Adaptation,
    AblativeCarapace,
    DNASiphon,
    GeneticCorruption,
    ParasiticAura,
    DefensiveAdaptation,
    EfficientAdaptation,
    OffensiveAdaptation,
  ],
};

export default powerset;
