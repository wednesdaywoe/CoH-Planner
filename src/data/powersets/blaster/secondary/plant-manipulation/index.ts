/**
 * Plant Manipulation Powerset
 * You can call forth and control the power of plants and flora to manipulate your foes, inflict damage and protect yourself. Animate and control vines, roots and spores to entrap, attack with deadly thorns and empower your attacks with powerful toxins.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/plant_manipulation
 */

import type { Powerset } from '@/types';

import { Entangle as Entangle } from './entangle';
import { Skewer as Skewer } from './skewer';
import { Strangler as Strangler } from './strangler';
import { Toxins as Toxins } from './toxins';
import { SporeCloud as SporeCloud } from './spore-cloud';
import { WildFortress as WildFortress } from './wild-fortress';
import { Ripper as Ripper } from './ripper';
import { Vines as Vines } from './vines';
import { ThornBurst as ThornBurst } from './thorn-burst';

export const powerset: Powerset = {
  id: 'blaster/plant-manipulation',
  name: 'Plant Manipulation',
  description: 'You can call forth and control the power of plants and flora to manipulate your foes, inflict damage and protect yourself. Animate and control vines, roots and spores to entrap, attack with deadly thorns and empower your attacks with powerful toxins.',
  icon: 'plant_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    Entangle,
    Skewer,
    Strangler,
    Toxins,
    SporeCloud,
    WildFortress,
    Ripper,
    Vines,
    ThornBurst,
  ],
};

export default powerset;
