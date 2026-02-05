/**
 * Beam Rifle Powerset
 * Your weapon of choice is a high-tech beam rifle capable of firing a wide variety of energy blasts at your foes. Your Beam Rifle attacks will have greater potency while Disintegration is in effect on your target. Additionally, single target Beam Rifle attacks used on targets suffering from the Disintegrating effect have a chance to spread this effect to nearby foes. Beam Rifle focuses on dealing a great deal of single target damage, but has a few area of effect attacks as well.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/beam_rifle
 */

import type { Powerset } from '@/types';

import { ChargedShot as ChargedShot } from './charged-shot';
import { SingleShot as SingleShot } from './single-shot';
import { CuttingBeam as CuttingBeam } from './cutting-beam';
import { Disintegrate as Disintegrate } from './disintegrate';
import { Aim as Aim } from './aim';
import { LancerShot as LancerShot } from './lancer-shot';
import { PenetratingRay as PenetratingRay } from './penetrating-ray';
import { PiercingBeam as PiercingBeam } from './piercing-beam';
import { Overcharge as Overcharge } from './overcharge';

export const powerset: Powerset = {
  id: 'corruptor/beam-rifle',
  name: 'Beam Rifle',
  description: 'Your weapon of choice is a high-tech beam rifle capable of firing a wide variety of energy blasts at your foes. Your Beam Rifle attacks will have greater potency while Disintegration is in effect on your target. Additionally, single target Beam Rifle attacks used on targets suffering from the Disintegrating effect have a chance to spread this effect to nearby foes. Beam Rifle focuses on dealing a great deal of single target damage, but has a few area of effect attacks as well.',
  icon: 'beam_rifle_set.png',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    ChargedShot,
    SingleShot,
    CuttingBeam,
    Disintegrate,
    Aim,
    LancerShot,
    PenetratingRay,
    PiercingBeam,
    Overcharge,
  ],
};

export default powerset;
