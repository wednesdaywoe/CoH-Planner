/**
 * Radiation Emission Powerset
 * Radiation Emission powers allow you to manipulate atomic particles and waves to protect your allies and weaken your enemies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/radiation_emission
 */

import type { Powerset } from '@/types';

import { AccelerateMetabolism as AccelerateMetabolism } from './accelerate-metabolism';
import { ChokingCloud as ChokingCloud } from './choking-cloud';
import { EMPulse as EMPulse } from './emp-pulse';
import { EnervatingField as EnervatingField } from './enervating-field';
import { Fallout as Fallout } from './fallout';
import { LingeringRadiation as LingeringRadiation } from './lingering-radiation';
import { Mutation as Mutation } from './mutation';
import { RadiantAura as RadiantAura } from './radiation-emission';
import { RadiationInfection as RadiationInfection } from './radiation-infection';

export const powerset: Powerset = {
  id: 'defender/radiation-emission',
  name: 'Radiation Emission',
  description: 'Radiation Emission powers allow you to manipulate atomic particles and waves to protect your allies and weaken your enemies.',
  icon: 'radiation_emission_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    AccelerateMetabolism,
    ChokingCloud,
    EMPulse,
    EnervatingField,
    Fallout,
    LingeringRadiation,
    Mutation,
    RadiantAura,
    RadiationInfection,
  ],
};

export default powerset;
