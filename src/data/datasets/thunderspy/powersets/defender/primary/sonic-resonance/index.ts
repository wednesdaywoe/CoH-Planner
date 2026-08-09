/**
 * Sonic Resonance Powerset
 * You have the ability to control sound in several fashions.  You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/sonic_debuff
 */

import type { Powerset } from '@/types';

import { SonicSiphon as SonicSiphon } from './sonic-siphon';
import { SonicBarrier as SonicBarrier } from './sonic-barrier';
import { SonicHaven as SonicHaven } from './sonic-haven';
import { DisruptionField as DisruptionField } from './disruption-field';
import { DisruptionAura as DisruptionAura } from './disruption-aura';
import { SonicDispersion as SonicDispersion } from './sonic-dispersion';
import { SonicRepulsion as SonicRepulsion } from './sonic-repulsion';
import { SonicCage as SonicCage } from './sonic-cage';
import { Clarity as Clarity } from './clarity';
import { Liquefy as Liquefy } from './liquefy';

export const powerset: Powerset = {
  id: 'defender/sonic-resonance',
  internalName: 'sonic_debuff',
  name: 'Sonic Resonance',
  description: 'You have the ability to control sound in several fashions.  You can create semi-solid barriers, set up waves which weaken or strengthen a target, as well as creating soothing sounds which act to counteract any negative effects which may exist on your friends.',
  icon: 'sonic_debuff_set.ico',
  archetype: 'defender',
  category: 'primary',
  powers: [
    SonicSiphon,
    SonicBarrier,
    SonicHaven,
    DisruptionField,
    DisruptionAura,
    SonicDispersion,
    SonicRepulsion,
    SonicCage,
    Clarity,
    Liquefy,
  ],
};

export default powerset;
