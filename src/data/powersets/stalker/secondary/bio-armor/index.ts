/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';
import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Hide as Hide } from './hide';
import { BoundlessEnergy as BoundlessEnergy } from './boundless-energy';
import { Adaptation as Adaptation } from './adaptation';
import { EnvironmentalModification as EnvironmentalModification } from './environmental-modification';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticCorruption as GeneticCorruption } from './genetic-corruption';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';

export const powerset: Powerset = {
  id: 'stalker/bio-armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.png',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    DefensiveAdaptation,
    EfficientAdaptation,
    OffensiveAdaptation,
    HardenedCarapace,
    Hide,
    BoundlessEnergy,
    Adaptation,
    EnvironmentalModification,
    AblativeCarapace,
    DNASiphon,
    GeneticCorruption,
    ParasiticAura,
  ],
};

export default powerset;
