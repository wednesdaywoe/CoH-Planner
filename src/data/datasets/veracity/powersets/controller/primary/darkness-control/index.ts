/**
 * Darkness Control Powerset
 * You can control darkness and shadow to disable your foes with negative energy.  Enemies that are affected by many of your attacks will have their chance to hit reduced.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/darkness_control
 */

import type { Powerset } from '@/types';

import { ShadowyBinds as ShadowyBinds } from './shadowy-binds';
import { DarkGrasp as DarkGrasp } from './dark-grasp';
import { ReapersScythe as ReapersScythe } from './reaper-s-scythe';
import { LivingShadows as LivingShadows } from './living-shadows';
import { UmbraBeast as UmbraBeast } from './umbra-beast';
import { Possess as Possess } from './possess';
import { FearsomeStare as FearsomeStare } from './fearsome-stare';
import { HeartofDarkness as HeartofDarkness } from './heart-of-darkness';
import { Haunt as Haunt } from './haunt';
import { ShadowField as ShadowField } from './shadow-field';

export const powerset: Powerset = {
  id: 'controller/darkness-control',
  name: 'Darkness Control',
  description: 'You can control darkness and shadow to disable your foes with negative energy.  Enemies that are affected by many of your attacks will have their chance to hit reduced.',
  icon: 'darkness_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    ShadowyBinds,
    DarkGrasp,
    ReapersScythe,
    LivingShadows,
    UmbraBeast,
    Possess,
    FearsomeStare,
    HeartofDarkness,
    Haunt,
    ShadowField,
  ],
};

export default powerset;
