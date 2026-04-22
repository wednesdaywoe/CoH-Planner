/**
 * Kinetics Powerset
 * You are a master at manipulating and transferring Kinetic energy. You can manipulate the potential energy found in objects to aid your allies or weaken your foes.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/kinetics
 */

import type { Powerset } from '@/types';

import { IncreaseDensity as IncreaseDensity } from './increase-density';
import { InertialReduction as InertialReduction } from './inertial-reduction';
import { FulcrumShift as FulcrumShift } from './kinetic-transfer';
import { Repel as Repel } from './repel';
import { SiphonPower as SiphonPower } from './siphon-power';
import { SiphonSpeed as SiphonSpeed } from './siphon-speed';
import { SpeedBoost as SpeedBoost } from './speed-boost';
import { Transference as Transference } from './transference';
import { Transfusion as Transfusion } from './transfusion';

export const powerset: Powerset = {
  id: 'defender/kinetics',
  name: 'Kinetics',
  description: 'You are a master at manipulating and transferring Kinetic energy. You can manipulate the potential energy found in objects to aid your allies or weaken your foes.',
  icon: 'kinetics_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    IncreaseDensity,
    InertialReduction,
    FulcrumShift,
    Repel,
    SiphonPower,
    SiphonSpeed,
    SpeedBoost,
    Transference,
    Transfusion,
  ],
};

export default powerset;
