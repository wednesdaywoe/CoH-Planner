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
import { ShiningShield as ShiningShield } from './shining-shield';
import { EssenceBoost as EssenceBoost } from './essence-boost';
import { CombatFlight as CombatFlight } from './combat-flight';
import { ThermalShield as ThermalShield } from './thermal-shield';
import { QuantumShield as QuantumShield } from './quantum-shield';
import { GroupEnergyFlight as GroupEnergyFlight } from './group-energy-flight';
import { GroupEnergyFlightFree as GroupEnergyFlightFree } from './group-energy-flight-free';
import { WhiteDwarf as WhiteDwarf } from './white-dwarf';
import { WhiteDwarfStrike as WhiteDwarfStrike } from './white-dwarf-strike';
import { WhiteDwarfSmite as WhiteDwarfSmite } from './white-dwarf-smite';
import { WhiteDwarfFlare as WhiteDwarfFlare } from './white-dwarf-flare';
import { WhiteDwarfSublimation as WhiteDwarfSublimation } from './white-dwarf-sublimation';
import { WhiteDwarfStep as WhiteDwarfStep } from './white-dwarf-step';
import { WhiteDwarfAntagonize as WhiteDwarfAntagonize } from './white-dwarf-antagonize';
import { ReformEssence as ReformEssence } from './reform-essence';
import { ConserveEnergy as ConserveEnergy } from './conserve-energy';
import { QuantumAcceleration as QuantumAcceleration } from './quantum-acceleration';
import { EnergyFlightQuantumAcceleration as EnergyFlightQuantumAcceleration } from './energy-flight-quantum-acceleration';
import { QuantumFlight as QuantumFlight } from './quantum-flight';
import { RestoreEssence as RestoreEssence } from './restore-essence';
import { LightForm as LightForm } from './light-form';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-aura',
  internalName: 'luminous_aura',
  name: 'Luminous Aura',
  description: 'Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.',
  icon: 'luminous_aura_set.ico',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    Incandescence,
    EnergyFlight,
    ShiningShield,
    EssenceBoost,
    CombatFlight,
    ThermalShield,
    QuantumShield,
    GroupEnergyFlight,
    GroupEnergyFlightFree,
    WhiteDwarf,
    WhiteDwarfStrike,
    WhiteDwarfSmite,
    WhiteDwarfFlare,
    WhiteDwarfSublimation,
    WhiteDwarfStep,
    WhiteDwarfAntagonize,
    ReformEssence,
    ConserveEnergy,
    QuantumAcceleration,
    EnergyFlightQuantumAcceleration,
    QuantumFlight,
    RestoreEssence,
    LightForm,
  ],
};

export default powerset;
