/**
 * Sonic Resonance Powerset
 * You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/sonic_resonance
 */

import type { Powerset } from '@/types';

import { Clarity as Clarity } from './clarity';
import { DisruptionField as DisruptionField } from './disruption-field';
import { Liquefy as Liquefy } from './liquefy';
import { SonicBarrier as SonicBarrier } from './sonic-barrier';
import { SonicCage as SonicCage } from './sonic-cage';
import { SonicDispersion as SonicDispersion } from './sonic-dispersion';
import { SonicHaven as SonicHaven } from './sonic-haven';
import { SonicRepulsion as SonicRepulsion } from './sonic-repulsion';
import { SonicSiphon as SonicSiphon } from './sonic-siphon';

export const powerset: Powerset = {
  id: 'mastermind/sonic-resonance',
  name: 'Sonic Resonance',
  description: 'You have the ability to control sound in several fashions. You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.',
  icon: 'sonic_resonance_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Clarity,
    DisruptionField,
    Liquefy,
    SonicBarrier,
    SonicCage,
    SonicDispersion,
    SonicHaven,
    SonicRepulsion,
    SonicSiphon,
  ],
};

export default powerset;
