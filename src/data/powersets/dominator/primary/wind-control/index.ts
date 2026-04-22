/**
 * Wind Control Powerset
 * Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/wind_control
 */

import type { Powerset } from '@/types';

import { Breathless as Breathless } from './breathless';
import { ClearSkies as ClearSkies } from './clear-skies';
import { Downdraft as Downdraft } from './downdraft';
import { KeeningWinds as KeeningWinds } from './keening-winds';
import { Microburst as Microburst } from './microburst';
import { Thundergust as Thundergust } from './thundergust';
import { Updraft as Updraft } from './updraft';
import { Vacuum as Vacuum } from './vacuum';
import { Vortex as Vortex } from './vortex';
import { WindShear as WindShear } from './wind-shear';

export const powerset: Powerset = {
  id: 'dominator/wind-control',
  name: 'Wind Control',
  description: 'Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.',
  icon: 'wind_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Breathless,
    ClearSkies,
    Downdraft,
    KeeningWinds,
    Microburst,
    Thundergust,
    Updraft,
    Vacuum,
    Vortex,
    WindShear,
  ],
};

export default powerset;
