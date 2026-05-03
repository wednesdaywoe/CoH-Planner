/**
 * Military Assault Powerset
 * Your mastery of Military Assault allows you to destroy your enemies with brutal precision. Blast your foes with powerful attacks from your military grade Assault Rifle and pummel them with brutal close quarters combat techniques. Your attacks can also inflict a variety of debilitating effects on your foes, including stunning them, reducing their defense, knocking them down, or slowing their movement.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/military_assault
 */

import type { Powerset } from '@/types';

import { SingleShot as SingleShot } from './single-shot';
import { Pummel as Pummel } from './pummel';
import { Burst as Burst } from './burst';
import { HeavyBurst as HeavyBurst } from './heavy-burst';
import { BuildUp as BuildUp } from './build-up';
import { ShinBreaker as ShinBreaker } from './shin-breaker';
import { SpinningStrike as SpinningStrike } from './spinning-strike';
import { SniperRound as SniperRound } from './sniper-round';
import { IncendiaryRound as IncendiaryRound } from './incendiary-round';

export const powerset: Powerset = {
  id: 'guardian/military-assault',
  name: 'Military Assault',
  description: 'Your mastery of Military Assault allows you to destroy your enemies with brutal precision. Blast your foes with powerful attacks from your military grade Assault Rifle and pummel them with brutal close quarters combat techniques. Your attacks can also inflict a variety of debilitating effects on your foes, including stunning them, reducing their defense, knocking them down, or slowing their movement.',
  icon: 'assault_rifle_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    SingleShot,
    Pummel,
    Burst,
    HeavyBurst,
    BuildUp,
    ShinBreaker,
    SpinningStrike,
    SniperRound,
    IncendiaryRound,
  ],
};

export default powerset;
