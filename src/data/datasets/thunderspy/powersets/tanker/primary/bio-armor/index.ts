/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment.  You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form.  Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: tanker
 * Category: primary
 * Source: tanker_defense/bio_organic_armor
 */

import type { Powerset } from '@/types';

import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { EnvironmentalAdaptation as EnvironmentalAdaptation } from './environmental-adaptation';
import { Adaptation as Adaptation } from './adaptation';
import { AblativeCarapace as AblativeCarapace } from './ablative-carapace';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { GeneticContamination as GeneticContamination } from './genetic-contamination';
import { Evolution as Evolution } from './evolution';
import { ParasiticAura as ParasiticAura } from './parasitic-aura';

export const powerset: Powerset = {
  id: 'tanker/bio-armor',
  internalName: 'bio_organic_armor',
  name: 'Bio Armor',
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment.  You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form.  Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.ico',
  archetype: 'tanker',
  category: 'primary',
  powers: [
    HardenedCarapace,
    Inexhaustible,
    EnvironmentalAdaptation,
    Adaptation,
    AblativeCarapace,
    DNASiphon,
    GeneticContamination,
    Evolution,
    ParasiticAura,
  ],
};

export default powerset;
