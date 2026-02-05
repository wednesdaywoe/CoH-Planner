/**
 * Radiation Blast Powerset
 * Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets' overall Defense.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/radiation_blast
 */

import type { Powerset } from '@/types';

import { NeutrinoBolt as NeutrinoBolt } from './neutrino-bolt';
import { XRayBeam as XRayBeam } from './x-ray-beam';
import { Irradiate as Irradiate } from './irradiate';
import { CosmicBurst as CosmicBurst } from './cosmic-burst';
import { Aim as Aim } from './aim';
import { ElectronHaze as ElectronHaze } from './electron-haze';
import { ProtonStream as ProtonStream } from './proton-stream';
import { NeutronBomb as NeutronBomb } from './neutron-bomb';
import { AtomicBlast as AtomicBlast } from './atomic-blast';

export const powerset: Powerset = {
  id: 'sentinel/radiation-blast',
  name: 'Radiation Blast',
  description: 'Blast your foes with lethal radiation. Radiation Blast powers can bypass normal defenses, and lower your targets\' overall Defense.',
  icon: 'radiation_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    NeutrinoBolt,
    XRayBeam,
    Irradiate,
    CosmicBurst,
    Aim,
    ElectronHaze,
    ProtonStream,
    NeutronBomb,
    AtomicBlast,
  ],
};

export default powerset;
