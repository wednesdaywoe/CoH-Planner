/**
 * Sonic Resonance Powerset
 * You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.
 *
 * Archetype: controller
 * Category: secondary
 * Source: controller_buff/sonic_debuff
 */

import type { Powerset } from '@/types';

import { Clarity as Clarity } from './clarity';
import { DisruptionField as DisruptionField } from './disruption-field';
import { Liquefy as Liquefy } from './liquefy';
import { SonicRepulsion as SonicRepulsion } from './sonic-repulsion';
import { SonicBarrier as SonicBarrier } from './sonic-barrier';
import { SonicCage as SonicCage } from './sonic-cage';
import { SonicDispersion as SonicDispersion } from './sonic-dispersion';
import { SonicHaven as SonicHaven } from './sonic-haven';
import { SonicSiphon as SonicSiphon } from './sonic-siphon';

export const powerset: Powerset = {
  id: 'controller/sonic-resonance',
  name: 'Sonic Resonance',
  description: 'You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.',
  icon: 'sonic_debuff_set.ico',
  archetype: 'controller',
  category: 'secondary',
  powers: [
    Clarity,
    DisruptionField,
    Liquefy,
    SonicRepulsion,
    SonicBarrier,
    SonicCage,
    SonicDispersion,
    SonicHaven,
    SonicSiphon,
  ],
};

export default powerset;
