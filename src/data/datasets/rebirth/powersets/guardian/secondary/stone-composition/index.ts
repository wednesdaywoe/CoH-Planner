/**
 * Stone Composition Powerset
 * Stone Composition users can transform themselves into various forms of rock and stone to avoid hard. You are also able to harness the crushing force of earth to weaken your foes and protect your allies.  Many of these powers need to be performed while on the ground.
 *
 * Archetype: guardian
 * Category: secondary
 * Source: guardian_comp/stone_composition
 */

import type { Powerset } from '@/types';

import { RockyArmor as RockyArmor } from './rocky-armor';
import { StoneShelter as StoneShelter } from './stone-shelter';
import { Quicksand as Quicksand } from './quicksand';
import { VolcanicArmor as VolcanicArmor } from './volcanic-armor';
import { GaiasBlessing as GaiasBlessing } from './gaias-blessing';
import { CrystallineArmor as CrystallineArmor } from './crystalline-armor';
import { StoneSkin as StoneSkin } from './stone-skin';
import { Earthquake as Earthquake } from './earthquake';
import { Eruption as Eruption } from './eruption';

export const powerset: Powerset = {
  id: 'guardian/stone-composition',
  name: 'Stone Composition',
  description: 'Stone Composition users can transform themselves into various forms of rock and stone to avoid hard. You are also able to harness the crushing force of earth to weaken your foes and protect your allies.  Many of these powers need to be performed while on the ground.',
  icon: 'stone_armor_set.ico',
  archetype: 'guardian',
  category: 'secondary',
  powers: [
    RockyArmor,
    StoneShelter,
    Quicksand,
    VolcanicArmor,
    GaiasBlessing,
    CrystallineArmor,
    StoneSkin,
    Earthquake,
    Eruption,
  ],
};

export default powerset;
