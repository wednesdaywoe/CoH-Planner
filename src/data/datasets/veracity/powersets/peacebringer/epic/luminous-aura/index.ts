/**
 * Luminous Aura Powerset
 * Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.
 *
 * Archetype: peacebringer
 * Category: epic
 * Source: peacebringer_defensive/luminous_aura
 */

import type { Powerset } from '@/types';

import { Incandescence as Incandescence } from './incandescence';
import { EnergyFlight as EnergyFlight } from './energy-flight';
import { CombatFlight as CombatFlight } from './combat-flight';
import { ShiningShield as ShiningShield } from './shining-shield';
import { EssenceBoost as EssenceBoost } from './essence-boost';
import { ThermalShield as ThermalShield } from './thermal-shield';
import { QuantumShield as QuantumShield } from './quantum-shield';
import { GroupEnergyFlight as GroupEnergyFlight } from './group-energy-flight';
import { WhiteDwarf as WhiteDwarf } from './white-dwarf';
import { LuminousEssenceBifurcation as LuminousEssenceBifurcation } from './luminous-essence-bifurcation';
import { ReformEssence as ReformEssence } from './reform-essence';
import { ConserveEnergy as ConserveEnergy } from './conserve-energy';
import { QuantumStep as QuantumStep } from './quantum-step';
import { QuantumAgitation as QuantumAgitation } from './quantum-agitation';
import { RestoreEssence as RestoreEssence } from './restore-essence';
import { LightForm as LightForm } from './light-form';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-aura',
  name: 'Luminous Aura',
  description: 'Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.',
  icon: 'luminous_aura_set.ico',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    Incandescence,
    EnergyFlight,
    CombatFlight,
    ShiningShield,
    EssenceBoost,
    ThermalShield,
    QuantumShield,
    GroupEnergyFlight,
    WhiteDwarf,
    LuminousEssenceBifurcation,
    ReformEssence,
    ConserveEnergy,
    QuantumStep,
    QuantumAgitation,
    RestoreEssence,
    LightForm,
  ],
};

export default powerset;
