/**
 * Beam Blast Powerset
 * Beam Blast allows you to blast your foes with powerful beams. Your Beam Blast attacks will have greater potency while Disintegration is in effect on your target.  Additionally, single target Beam Blast attacks used on targets suffering from the Disintegrating effect have a chance to spread this effect to nearby foes.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/beam_rifle
 */

import type { Powerset } from '@/types';

import { SingleShot as SingleShot } from './single-shot';
import { ChargedShot as ChargedShot } from './charged-shot';
import { CuttingBeam as CuttingBeam } from './cutting-beam';
import { Disintegrate as Disintegrate } from './disintegrate';
import { LancerShot as LancerShot } from './lancer-shot';
import { Aim as Aim } from './aim';
import { PiercingBeam as PiercingBeam } from './piercing-beam';
import { PenetratingRay as PenetratingRay } from './penetrating-ray';
import { Overcharge as Overcharge } from './overcharge';

export const powerset: Powerset = {
  id: 'defender/beam-blast',
  setPath: 'Defender_Ranged.Beam_Rifle',
  name: 'Beam Blast',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Beam Blast allows you to blast your foes with powerful beams. Your Beam Blast attacks will have greater potency while Disintegration is in effect on your target.  Additionally, single target Beam Blast attacks used on targets suffering from the Disintegrating effect have a chance to spread this effect to nearby foes.",
  icon: 'beam_rifle_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    SingleShot,
    ChargedShot,
    CuttingBeam,
    Disintegrate,
    LancerShot,
    Aim,
    PiercingBeam,
    PenetratingRay,
    Overcharge,
  ],
};

export default powerset;
