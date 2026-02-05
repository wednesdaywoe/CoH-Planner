/**
 * Sonic Resonance Powerset
 * You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/sonic_resonance
 */

import type { Powerset } from '@/types';

import { SonicBarrier as SonicBarrier } from './sonic-barrier';
import { SonicSiphon as SonicSiphon } from './sonic-siphon';
import { SonicHaven as SonicHaven } from './sonic-haven';
import { SonicCage as SonicCage } from './sonic-cage';
import { DisruptionField as DisruptionField } from './disruption-field';
import { SonicDispersion as SonicDispersion } from './sonic-dispersion';
import { SonicRepulsion as SonicRepulsion } from './sonic-repulsion';
import { Clarity as Clarity } from './clarity';
import { Liquefy as Liquefy } from './liquefy';

export const powerset: Powerset = {
  id: 'corruptor/sonic-resonance',
  name: 'Sonic Resonance',
  description: 'You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.',
  icon: 'sonic_resonance_set.png',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    SonicBarrier,
    SonicSiphon,
    SonicHaven,
    SonicCage,
    DisruptionField,
    SonicDispersion,
    SonicRepulsion,
    Clarity,
    Liquefy,
  ],
};

export default powerset;
