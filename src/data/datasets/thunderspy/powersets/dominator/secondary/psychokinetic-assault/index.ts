/**
 * Psychokinetic Assault Powerset
 * Strike your foes with manifested whips and swords. Each strike manifests a psychokinetic sword that will fight alongside you for a short time
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/telekinetic_assault
 */

import type { Powerset } from '@/types';

import { PsiWhipLash as PsiWhipLash } from './psiwhip-lash';
import { PsiBladeSlash as PsiBladeSlash } from './psiblade-slash';
import { PsiWhipCrack as PsiWhipCrack } from './psiwhip-crack';
import { PsiWhipThrash as PsiWhipThrash } from './psiwhip-thrash';
import { Manifest as Manifest } from './manifest';
import { PsiBladeSpin as PsiBladeSpin } from './psiblade-spin';
import { PsiBladeSlam as PsiBladeSlam } from './psiblade-slam';
import { TelekineticPulse as TelekineticPulse } from './telekinetic-pulse';
import { PsiWhipCoil as PsiWhipCoil } from './psiwhip-coil';

export const powerset: Powerset = {
  id: 'dominator/psychokinetic-assault',
  setPath: 'Dominator_Assault.Telekinetic_Assault',
  name: 'Psychokinetic Assault',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Strike your foes with manifested whips and swords. Each strike manifests a psychokinetic sword that will fight alongside you for a short time',
  icon: 'psionic_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    PsiWhipLash,
    PsiBladeSlash,
    PsiWhipCrack,
    PsiWhipThrash,
    Manifest,
    PsiBladeSpin,
    PsiBladeSlam,
    TelekineticPulse,
    PsiWhipCoil,
  ],
};

export default powerset;
