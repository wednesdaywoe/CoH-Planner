/**
 * Kinetics Powerset
 * You are a master at manipulating and transferring Kinetic energy. You can manipulate the potential energy found in objects to aid your allies or weaken your foes.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/kinetics
 */

import type { Powerset } from '@/types';

import { SiphonPower as SiphonPower } from './siphon-power';
import { Transfusion as Transfusion } from './transfusion';
import { Repel as Repel } from './repel';
import { SiphonSpeed as SiphonSpeed } from './siphon-speed';
import { IncreaseDensity as IncreaseDensity } from './increase-density';
import { SpeedBoost as SpeedBoost } from './speed-boost';
import { InertialReduction as InertialReduction } from './inertial-reduction';
import { Transference as Transference } from './transference';
import { FulcrumShift as FulcrumShift } from './fulcrum-shift';

export const powerset: Powerset = {
  id: 'defender/kinetics',
  name: 'Kinetics',
  description: 'You are a master at manipulating and transferring Kinetic energy. You can manipulate the potential energy found in objects to aid your allies or weaken your foes.',
  icon: 'kinetics_set.png',
  archetype: 'defender',
  category: 'primary',
  powers: [
    SiphonPower,
    Transfusion,
    Repel,
    SiphonSpeed,
    IncreaseDensity,
    SpeedBoost,
    InertialReduction,
    Transference,
    FulcrumShift,
  ],
};

export default powerset;
