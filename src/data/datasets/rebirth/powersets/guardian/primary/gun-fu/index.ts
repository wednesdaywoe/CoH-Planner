/**
 * Gun Fu Powerset
 * You are a master of the Gun Fu fighting style. You seamlessly blend sophisticated martial arts perfectly with your skills as a shootist to strike down foes with either hand or bullet.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/gun_fu
 */

import type { Powerset } from '@/types';

import { Pistols as Pistols } from './pistols';
import { CraneKick as CraneKick } from './crane-kick';
import { SpinningKick as SpinningKick } from './spinning-kick';
import { DualWield as DualWield } from './dual-wield';
import { FocusChi as FocusChi } from './focus-chi';
import { EmptyClips as EmptyClips } from './empty-clips';
import { CripplingAxeKick as CripplingAxeKick } from './crippling-axe-kick';
import { PiercingRounds as PiercingRounds } from './piercing-rounds';
import { EaglesClaw as EaglesClaw } from './eagles-claw';

export const powerset: Powerset = {
  id: 'guardian/gun-fu',
  name: 'Gun Fu',
  description: 'You are a master of the Gun Fu fighting style. You seamlessly blend sophisticated martial arts perfectly with your skills as a shootist to strike down foes with either hand or bullet.',
  icon: 'dual_pistols_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    Pistols,
    CraneKick,
    SpinningKick,
    DualWield,
    FocusChi,
    EmptyClips,
    CripplingAxeKick,
    PiercingRounds,
    EaglesClaw,
  ],
};

export default powerset;
