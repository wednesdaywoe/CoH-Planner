/**
 * Radioactive Assault Powerset
 * You are able to harness the power of Radiation to crush your foes at range and in close quarters. Radioactive Assault attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Neutrino Bolt, Contaminated Strike, Radiation Siphon, X-Ray Beam, Proton Volley and Devastating Blow cause a portion of that power's damage to also hit nearby foes. Radiation Assault attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/radioactive_assault
 */

import type { Powerset } from '@/types';

import { AtomSmasher as AtomSmasher } from './atom-smasher';
import { ContaminatedStrike as ContaminatedStrike } from './contaminated-strike';
import { DevastatingBlow as DevastatingBlow } from './devastating-blow';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { Fusion as Fusion } from './fusion';
import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { ProtonVolley as ProtonVolley } from './proton-volley';
import { RadiationSiphon as RadiationSiphon } from './radiation-siphon';
import { XRayBeam as XRayBeam } from './x-ray-beam';

export const powerset: Powerset = {
  id: 'dominator/radioactive-assault',
  name: 'Radioactive Assault',
  description: 'You are able to harness the power of Radiation to crush your foes at range and in close quarters. Radioactive Assault attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Hitting Contaminated targets with Neutrino Bolt, Contaminated Strike, Radiation Siphon, X-Ray Beam, Proton Volley and Devastating Blow cause a portion of that power\'s damage to also hit nearby foes. Radiation Assault attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.',
  icon: 'radioactive_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    AtomSmasher,
    ContaminatedStrike,
    DevastatingBlow,
    ElectronHaze,
    Fusion,
    NeutrinoBolt,
    ProtonVolley,
    RadiationSiphon,
    XRayBeam,
  ],
};

export default powerset;
