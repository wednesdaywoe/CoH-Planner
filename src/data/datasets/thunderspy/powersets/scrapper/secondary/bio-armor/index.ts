/**
 * Bio Armor Powerset
 * Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment.  You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form.  Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.
 *
 * Archetype: scrapper
 * Category: secondary
 * Source: scrapper_defense/bio_organic_armor
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
  id: 'scrapper/bio-armor',
  setPath: 'Scrapper_Defense.Bio_Organic_Armor',
  name: 'Bio Armor',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Your body is shielded by an incredibly durable Bio Armor that evolves based upon your environment.  You are also able to siphon genetic data from your foes to empower yourself as well as shift from a Defensive, Offensive and Efficient form.  Bio Armor provides good damage resistance and defense, a fair amount of regeneration and a good number of offensive/debuff power options.',
  icon: 'bio_organic_armor_set.ico',
  archetype: 'scrapper',
  category: 'secondary',
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
