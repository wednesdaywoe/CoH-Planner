/**
 * Radiation Assault Powerset
 * You are able to harness the power of the atom to defeat foes at both close and far ranges. Radiation Assault attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Single target attacks hitting Contaminated targets causes a portion of that power's damage to also hit nearby foes. Radiation Assault attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/radiation_assault
 */

import type { Powerset } from '@/types';

import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { RadioactiveSmash as RadioactiveSmash } from './radioactive-smash';
import { XRayBeam as XRayBeam } from './x-ray-beam';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { Fusion as Fusion } from './fusion';
import { RadiationSiphon as RadiationSiphon } from './radiation-siphon';
import { DevastatingBlow as DevastatingBlow } from './devastating-blow';
import { ProtonVolley as ProtonVolley } from './proton-volley';
import { AtomSmasher as AtomSmasher } from './atom-smasher';

export const powerset: Powerset = {
  id: 'guardian/radiation-assault',
  name: 'Radiation Assault',
  description: 'You are able to harness the power of the atom to defeat foes at both close and far ranges. Radiation Assault attacks have a chance to inflict the Contaminated state on a target for a moderate amount of time. Powers that deal greater damage, have a longer recharge time and animation time have a greater chance to inflict Contaminated. Single target attacks hitting Contaminated targets causes a portion of that power\'s damage to also hit nearby foes. Radiation Assault attacks primarily deal smashing and energy damage, but this set is also capable of dealing some toxic damage.',
  icon: 'radiation_blast_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    NeutrinoBolt,
    RadioactiveSmash,
    XRayBeam,
    ElectronHaze,
    Fusion,
    RadiationSiphon,
    DevastatingBlow,
    ProtonVolley,
    AtomSmasher,
  ],
};

export default powerset;
