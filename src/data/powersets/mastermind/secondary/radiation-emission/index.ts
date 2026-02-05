/**
 * Radiation Emission Powerset
 * Radiation Emission powers allow you to manipulate atomic particles and waves to protect your allies and weaken your enemies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/radiation_emission
 */

import type { Powerset } from '@/types';

import { RadiantAura as RadiantAura } from './radiant-aura';
import { RadiationInfection as RadiationInfection } from './radiation-infection';
import { AccelerateMetabolism as AccelerateMetabolism } from './accelerate-metabolism';
import { EnervatingField as EnervatingField } from './enervating-field';
import { Mutation as Mutation } from './mutation';
import { LingeringRadiation as LingeringRadiation } from './lingering-radiation';
import { ChokingCloud as ChokingCloud } from './choking-cloud';
import { Fallout as Fallout } from './fallout';
import { EMPulse as EMPulse } from './em-pulse';

export const powerset: Powerset = {
  id: 'mastermind/radiation-emission',
  name: 'Radiation Emission',
  description: 'Radiation Emission powers allow you to manipulate atomic particles and waves to protect your allies and weaken your enemies.',
  icon: 'radiation_emission_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    RadiantAura,
    RadiationInfection,
    AccelerateMetabolism,
    EnervatingField,
    Mutation,
    LingeringRadiation,
    ChokingCloud,
    Fallout,
    EMPulse,
  ],
};

export default powerset;
