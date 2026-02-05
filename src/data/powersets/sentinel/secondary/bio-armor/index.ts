/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: sentinel
 * Category: secondary
 * Source: sentinel_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { DefensiveAdaptation as DefensiveAdaptation } from './defensive-adaptation';
import { EfficientAdaptation as EfficientAdaptation } from './efficient-adaptation';
import { OffensiveAdaptation as OffensiveAdaptation } from './offensive-adaptation';
import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { Adaptation as Adaptation } from './adaptation';
import { EnvironmentalAdaptation as EnvironmentalAdaptation } from './environmental-adaptation';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { RebuildDNA as RebuildDNA } from './rebuild-dna';
import { AthleticRegulation as AthleticRegulation } from './athletic-regulation';
import { GenomicEvolution as GenomicEvolution } from './genomic-evolution';
import { ParasiticLeech as ParasiticLeech } from './parasitic-leech';

export const powerset: Powerset = {
  id: 'sentinel/bio-armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment. You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form. Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.png',
  archetype: 'sentinel',
  category: 'secondary',
  powers: [
    DefensiveAdaptation,
    EfficientAdaptation,
    OffensiveAdaptation,
    HardenedCarapace,
    Inexhaustible,
    Adaptation,
    EnvironmentalAdaptation,
    AblativeCarapace,
    RebuildDNA,
    AthleticRegulation,
    GenomicEvolution,
    ParasiticLeech,
  ],
};

export default powerset;
