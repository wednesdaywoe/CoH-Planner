/**
 * Force Field Powerset
 * The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/force_field
 */

import type { Powerset } from '@/types';

import { PersonalForceField as PersonalForceField } from './personal-force-field';
import { DeflectionShield as DeflectionShield } from './deflection-shield';
import { ForceBolt as ForceBolt } from './force-bolt';
import { InsulationShield as InsulationShield } from './insulation-shield';
import { BarrierField as BarrierField } from './refraction-shield';
import { DispersionBubble as DispersionBubble } from './dispersion-bubble';
import { ContainmentShell as ContainmentShell } from './repulsion-field';
import { RepulsionBomb as RepulsionBomb } from './repulsion-bomb';
import { ForceBubble as ForceBubble } from './force-bubble';
import { RepulsionField as RepulsionField } from './repulsion-field-new';

export const powerset: Powerset = {
  id: 'defender/force-field',
  name: 'Force Field',
  description: 'The Force Field powers give you the ability to create shells of energy that protect yourself and your allies from various forms of damage and harm.  Force Fields do not reduce damage, but reduced your allies chance of getting hit in the first place.',
  icon: 'force_field_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    PersonalForceField,
    DeflectionShield,
    ForceBolt,
    InsulationShield,
    BarrierField,
    DispersionBubble,
    ContainmentShell,
    RepulsionBomb,
    ForceBubble,
    RepulsionField,
  ],
};

export default powerset;
