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
import { ShiningShield as ShiningShield } from './shining-shield';
import { EssenceBoost as EssenceBoost } from './essence-boost';
import { ThermalShield as ThermalShield } from './thermal-shield';
import { QuantumShield as QuantumShield } from './quantum-shield';
import { GroupEnergyFlight as GroupEnergyFlight } from './group-energy-flight';
import { WhiteDwarf as WhiteDwarf } from './white-dwarf';
import { ReformEssence as ReformEssence } from './reform-essence';
import { ConserveEnergy as ConserveEnergy } from './conserve-energy';
import { QuantumFlight as QuantumFlight } from './quantum-flight';
import { RestoreEssence as RestoreEssence } from './restore-essence';
import { LightForm as LightForm } from './light-form';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-aura',
  setPath: 'Peacebringer_Defensive.Luminous_Aura',
  name: 'Luminous Aura',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.',
  icon: 'luminous_aura_set.ico',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    Incandescence,
    ShiningShield,
    EssenceBoost,
    ThermalShield,
    QuantumShield,
    GroupEnergyFlight,
    WhiteDwarf,
    ReformEssence,
    ConserveEnergy,
    QuantumFlight,
    RestoreEssence,
    LightForm,
  ],
};

export default powerset;
