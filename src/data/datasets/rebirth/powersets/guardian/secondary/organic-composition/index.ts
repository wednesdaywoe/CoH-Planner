/**
 * Organic Composition Powerset
 * Organic Composition users can surround themselves in the forces of nature, enabling them to shield their bodies from harm. Their command over the environment allows them to call forth primal energies to hinder their foes and aid themselves and their allies.  Some of their powers place a Bloom effect on themselves and their allies.  Each stack of Bloom boosts healing effects on the affected targets by 4% for 30 seconds.  Bloom can stack up to 5 times.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/organic_composition
 */

import type { Powerset } from '@/types';

import { HardenedCarapace as HardenedCarapace } from './hardened-carapace';
import { Regrowth as Regrowth } from './regrowth';
import { EnvironmentalModification as EnvironmentalModification } from './environmental-modification';
import { Inexhaustible as Inexhaustible } from './inexhaustible';
import { WildGrowth as WildGrowth } from './wild-growth';
import { EvolvingArmor as EvolvingArmor } from './evolving-armor';
import { DNASiphon as DNASiphon } from './dna-siphon';
import { WildBastion as WildBastion } from './wild-bastion';
import { Overgrowth as Overgrowth } from './overgrowth';

export const powerset: Powerset = {
  id: 'guardian/organic-composition',
  name: 'Organic Composition',
  description: 'Organic Composition users can surround themselves in the forces of nature, enabling them to shield their bodies from harm. Their command over the environment allows them to call forth primal energies to hinder their foes and aid themselves and their allies.  Some of their powers place a Bloom effect on themselves and their allies.  Each stack of Bloom boosts healing effects on the affected targets by 4% for 30 seconds.  Bloom can stack up to 5 times.',
  icon: 'bio_organic_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    HardenedCarapace,
    Regrowth,
    EnvironmentalModification,
    Inexhaustible,
    WildGrowth,
    EvolvingArmor,
    DNASiphon,
    WildBastion,
    Overgrowth,
  ],
};

export default powerset;
