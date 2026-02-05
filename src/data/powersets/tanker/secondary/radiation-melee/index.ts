/**
 * Radiation Melee Powerset
 * You are able to harness the power of Radiation to crush your foes in close quarters. Radiation Melee attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Contaminated Strike, Radioactive Smash, Radiation Siphon and Devastating Blow cause a portion of that power's damage to also hit nearby foes. Radiation Melee attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/radiation_melee
 */

import type { Powerset } from '@/types';

import { ContaminatedStrike as ContaminatedStrike } from './contaminated-strike';
import { RadioactiveSmash as RadioactiveSmash } from './radioactive-smash';
import { ProtonSweep as ProtonSweep } from './proton-sweep';
import { Taunt as Taunt } from './taunt';
import { RadiationSiphon as RadiationSiphon } from './radiation-siphon';
import { Fusion as Fusion } from './fusion';
import { IrradiatedGround as IrradiatedGround } from './irradiated-ground';
import { DevastatingBlow as DevastatingBlow } from './devastating-blow';
import { AtomSmasher as AtomSmasher } from './atom-smasher';

export const powerset: Powerset = {
  id: 'tanker/radiation-melee',
  name: 'Radiation Melee',
  description: 'You are able to harness the power of Radiation to crush your foes in close quarters. Radiation Melee attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Contaminated Strike, Radioactive Smash, Radiation Siphon and Devastating Blow cause a portion of that power\'s damage to also hit nearby foes. Radiation Melee attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.',
  icon: 'radiation_melee_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    ContaminatedStrike,
    RadioactiveSmash,
    ProtonSweep,
    Taunt,
    RadiationSiphon,
    Fusion,
    IrradiatedGround,
    DevastatingBlow,
    AtomSmasher,
  ],
};

export default powerset;
