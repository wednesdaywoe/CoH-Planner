/**
 * Radiation Blast Powerset
 * Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets' overall Defense.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/radiation_blast
 */

import type { Powerset } from '@/types';

import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { XRayBeam as XRayBeam } from './x-ray-beam';
import { Irradiate as Irradiate } from './irradiate';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { ProtonVolley as ProtonVolley } from './proton-volley';
import { Aim as Aim } from './aim';
import { CosmicBurst as CosmicBurst } from './cosmic-burst';
import { NeutronBomb as NeutronBomb } from './neutron-bomb';
import { AtomicBlast as AtomicBlast } from './atomic-blast';

export const powerset: Powerset = {
  id: 'corruptor/radiation-blast',
  name: 'Radiation Blast',
  description: 'Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets\' overall Defense.',
  icon: 'radiation_blast_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    NeutrinoBolt,
    XRayBeam,
    Irradiate,
    ElectronHaze,
    ProtonVolley,
    Aim,
    CosmicBurst,
    NeutronBomb,
    AtomicBlast,
  ],
};

export default powerset;
