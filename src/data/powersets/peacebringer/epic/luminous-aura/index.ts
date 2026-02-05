/**
 * Luminous Aura Powerset
 * Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.
 *
 * Archetype: peacebringer
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { Incandescence } from './incandescence';
import { ShiningShield } from './shining-shield';
import { EssenceBoost } from './essence-boost';
import { ThermalShield } from './thermal-shield';
import { CombatFlight } from './combat-flight';
import { QuantumShield } from './quantum-shield';
import { GroupEnergyFlight } from './group-energy-flight';
import { WhiteDwarf } from './white-dwarf';
import { WhiteDwarfStrike } from './white-dwarf-strike';
import { WhiteDwarfSmite } from './white-dwarf-smite';
import { WhiteDwarfFlare } from './white-dwarf-flare';
import { WhiteDwarfSublimation } from './white-dwarf-sublimation';
import { WhiteDwarfStep } from './white-dwarf-step';
import { WhiteDwarfAntagonize } from './white-dwarf-antagonize';
import { ReformEssence } from './reform-essence';
import { ConserveEnergy } from './conserve-energy';
import { QuantumManeuvers } from './quantum-maneuvers';
import { QuantumFlight } from './quantum-flight';
import { RestoreEssence } from './restore-essence';
import { LightForm } from './light-form';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-aura',
  name: 'Luminous Aura',
  description: 'Peacebringers can generate Luminous Aura to grant themselves incredible defensive capabilities.',
  icon: 'luminous_aura_set.png',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    Incandescence,
    ShiningShield,
    EssenceBoost,
    ThermalShield,
    CombatFlight,
    QuantumShield,
    GroupEnergyFlight,
    WhiteDwarf,
    WhiteDwarfStrike,
    WhiteDwarfSmite,
    WhiteDwarfFlare,
    WhiteDwarfSublimation,
    WhiteDwarfStep,
    WhiteDwarfAntagonize,
    ReformEssence,
    ConserveEnergy,
    QuantumManeuvers,
    QuantumFlight,
    RestoreEssence,
    LightForm,
  ],
};

export default powerset;
