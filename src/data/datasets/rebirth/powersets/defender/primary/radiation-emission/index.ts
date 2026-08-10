/**
 * Radiation Emission Powerset
 * Radiation Emission powers allow you to manipulate atomic particles and waves to protect your allies and weaken your enemies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/radiation_emission
 */

import type { Powerset } from '@/types';

import { RadiationEmission as RadiationEmission } from './radiation-emission';
import { RadiationInfection as RadiationInfection } from './radiation-infection';
import { AccelerateMetabolism as AccelerateMetabolism } from './accelerate-metabolism';
import { EnervatingField as EnervatingField } from './enervating-field';
import { Mutation as Mutation } from './mutation';
import { Lingeringradiation as Lingeringradiation } from './lingering-radiation';
import { ChokingCloud as ChokingCloud } from './choking-cloud';
import { Fallout as Fallout } from './fallout';
import { EMPPulse as EMPPulse } from './emp-pulse';

export const powerset: Powerset = {
  id: 'defender/radiation-emission',
  setPath: 'Defender_Buff.Radiation_Emission',
  name: 'Radiation Emission',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Radiation Emission powers allow you to manipulate atomic particles and waves to protect your allies and weaken your enemies.',
  icon: 'radiation_emission_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    RadiationEmission,
    RadiationInfection,
    AccelerateMetabolism,
    EnervatingField,
    Mutation,
    Lingeringradiation,
    ChokingCloud,
    Fallout,
    EMPPulse,
  ],
};

export default powerset;
