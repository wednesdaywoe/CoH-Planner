/**
 * Atomic Manipulation Powerset
 * Atomic Manipulation allows you to channel the power of the atom to deliver deadly blows. These powers also help you focus your power to increase your own abilities. Atomic Manipulation attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Contaminated Strike, Radioactive Smash, Radiation Siphon and Devastating Blow cause a portion of that power's damage to also hit nearby foes.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/radiation_manipulation
 */

import type { Powerset } from '@/types';

import { ContaminatedStrike as ContaminatedStrike } from './contaminated-strike';
import { RadioactiveSmash as RadioactiveSmash } from './radioactive-smash';
import { ChokingCloud as ChokingCloud } from './choking-cloud';
import { FusionalBuildUp as FusionalBuildUp } from './fusional-build-up';
import { RadiationSiphon as RadiationSiphon } from './radiation-siphon';
import { MetabolicAura as MetabolicAura } from './metabolic-aura';
import { DevastatingBlow as DevastatingBlow } from './devastating-blow';
import { Fallout as Fallout } from './fallout';
import { NuclearMutation as NuclearMutation } from './nuclear-mutation';

export const powerset: Powerset = {
  id: 'blaster/atomic-manipulation',
  internalName: 'radiation_manipulation',
  name: 'Atomic Manipulation',
  description: 'Atomic Manipulation allows you to channel the power of the atom to deliver deadly blows. These powers also help you focus your power to increase your own abilities. Atomic Manipulation attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Contaminated Strike, Radioactive Smash, Radiation Siphon and Devastating Blow cause a portion of that power\'s damage to also hit nearby foes.',
  icon: 'radiation_melee_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    ContaminatedStrike,
    RadioactiveSmash,
    ChokingCloud,
    FusionalBuildUp,
    RadiationSiphon,
    MetabolicAura,
    DevastatingBlow,
    Fallout,
    NuclearMutation,
  ],
};

export default powerset;
