/**
 * Luminous Aura Powerset
 * Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.
 *
 * Archetype: peacebringer
 * Category: epic
 * Source: peacebringer_defensive/luminous_aura
 */

import type { Powerset } from '@/types';

import { EnergyFlight as EnergyFlight } from './energy-flight';
import { Incandescence as Incandescence } from './incandescence';
import { ShiningShield as ShiningShield } from './shining-shield';
import { EssenceBoost as EssenceBoost } from './essence-boost';
import { CombatFlight as CombatFlight } from './combat-flight';
import { ThermalShield as ThermalShield } from './thermal-shield';
import { QuantumShield as QuantumShield } from './quantum-shield';
import { GroupEnergyFlight as GroupEnergyFlight } from './group-energy-flight';
import { WhiteDwarf as WhiteDwarf } from './white-dwarf';
import { WhiteDwarfAntagonize as WhiteDwarfAntagonize } from './white-dwarf-antagonize';
import { WhiteDwarfFlare as WhiteDwarfFlare } from './white-dwarf-flare';
import { WhiteDwarfSmite as WhiteDwarfSmite } from './white-dwarf-smite';
import { WhiteDwarfStep as WhiteDwarfStep } from './white-dwarf-step';
import { WhiteDwarfStrike as WhiteDwarfStrike } from './white-dwarf-strike';
import { WhiteDwarfSublimation as WhiteDwarfSublimation } from './white-dwarf-sublimation';
import { ReformEssence as ReformEssence } from './reform-essence';
import { ConserveEnergy as ConserveEnergy } from './conserve-energy';
import { QuantumManeuvers as QuantumManeuvers } from './quantum-acceleration';
import { QuantumFlight as QuantumFlight } from './quantum-flight';
import { RestoreEssence as RestoreEssence } from './restore-essence';
import { LightForm as LightForm } from './light-form';
import { QuantumAcceleration as QuantumAcceleration } from './quantum-boost';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-aura',
  name: 'Luminous Aura',
  description: 'Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.',
  icon: 'luminous_aura_set.ico',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    EnergyFlight,
    Incandescence,
    ShiningShield,
    EssenceBoost,
    CombatFlight,
    ThermalShield,
    QuantumShield,
    GroupEnergyFlight,
    WhiteDwarf,
    WhiteDwarfAntagonize,
    WhiteDwarfFlare,
    WhiteDwarfSmite,
    WhiteDwarfStep,
    WhiteDwarfStrike,
    WhiteDwarfSublimation,
    ReformEssence,
    ConserveEnergy,
    QuantumManeuvers,
    QuantumFlight,
    RestoreEssence,
    LightForm,
    QuantumAcceleration,
  ],
};

export default powerset;
