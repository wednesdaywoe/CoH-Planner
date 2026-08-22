/**
 * Pale Blade Powerset
 * The Pale Blade commands rot and disease as deftly as he swings his sword. Wield the Pale Blade to spread sickening Toxic damage in a wide area. The Pale Blade's powers are adept at reducing enemy Regeneration, and spreading contagious DoTs.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/pale_blade
 */

import type { Powerset } from '@/types';

import { Lash as Lash } from './lash';
import { FetidPresence as FetidPresence } from './fetid-presence';
import { Flay as Flay } from './flay';
import { RendFlesh as RendFlesh } from './rend-flesh';
import { BuildUp as BuildUp } from './build-up';
import { PaleWind as PaleWind } from './pale-wind';
import { Taunt as Taunt } from './taunt';
import { Khloros as Khloros } from './khloros';
import { PaleBlade as PaleBlade } from './pale-blade';
import { SunderBone as SunderBone } from './sunder-bone';

export const powerset: Powerset = {
  id: 'tanker/pale-blade',
  setPath: 'Tanker_Melee.Pale_Blade',
  name: 'Pale Blade',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "The Pale Blade commands rot and disease as deftly as he swings his sword. Wield the Pale Blade to spread sickening Toxic damage in a wide area. The Pale Blade's powers are adept at reducing enemy Regeneration, and spreading contagious DoTs.",
  icon: 'battle_axe_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Lash,
    FetidPresence,
    Flay,
    RendFlesh,
    BuildUp,
    PaleWind,
    Taunt,
    Khloros,
    PaleBlade,
    SunderBone,
  ],
};

export default powerset;
