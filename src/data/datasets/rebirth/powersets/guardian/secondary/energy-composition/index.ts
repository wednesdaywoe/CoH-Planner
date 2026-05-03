/**
 * Energy Composition Powerset
 * Energy Composition users can surround themselves with powerful defensive energy auras. Their mastery of energy allows them to manipulate and transfer energy from foes to protect themselves and their allies.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/energy_composition
 */

import type { Powerset } from '@/types';

import { KineticShield as KineticShield } from './kinetic-shield';
import { SiphonPower as SiphonPower } from './siphon-power';
import { PowerShield as PowerShield } from './power-shield';
import { EntropyShield as EntropyShield } from './entropy-shield';
import { InertialSiphon as InertialSiphon } from './inertial-siphon';
import { MassEnergize as MassEnergize } from './mass-energize';
import { KineticDampening as KineticDampening } from './kinetic-dampening';
import { Transference as Transference } from './transference';
import { FulcrumFlip as FulcrumFlip } from './fulcrum-flip';

export const powerset: Powerset = {
  id: 'guardian/energy-composition',
  name: 'Energy Composition',
  description: 'Energy Composition users can surround themselves with powerful defensive energy auras. Their mastery of energy allows them to manipulate and transfer energy from foes to protect themselves and their allies.',
  icon: 'energy_aura_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    KineticShield,
    SiphonPower,
    PowerShield,
    EntropyShield,
    InertialSiphon,
    MassEnergize,
    KineticDampening,
    Transference,
    FulcrumFlip,
  ],
};

export default powerset;
