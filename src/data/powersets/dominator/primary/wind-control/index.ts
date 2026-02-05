/**
 * Wind Control Powerset
 * Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/wind_control
 */

import type { Powerset } from '@/types';

import { ClearSkies as ClearSkies } from './clear-skies';
import { Downdraft as Downdraft } from './downdraft';
import { Updraft as Updraft } from './updraft';
import { Breathless as Breathless } from './breathless';
import { WindShear as WindShear } from './wind-shear';
import { Thundergust as Thundergust } from './thundergust';
import { Microburst as Microburst } from './microburst';
import { KeeningWinds as KeeningWinds } from './keening-winds';
import { Vacuum as Vacuum } from './vacuum';
import { Vortex as Vortex } from './vortex';

export const powerset: Powerset = {
  id: 'dominator/wind-control',
  name: 'Wind Control',
  description: 'Through manipulation of pressure, you are able to channel the force of wind to bind, weaken and crush your opponents.',
  icon: 'wind_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    ClearSkies,
    Downdraft,
    Updraft,
    Breathless,
    WindShear,
    Thundergust,
    Microburst,
    KeeningWinds,
    Vacuum,
    Vortex,
  ],
};

export default powerset;
