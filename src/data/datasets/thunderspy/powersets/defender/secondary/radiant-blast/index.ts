/**
 * Radiant Blast Powerset
 * You Channel radiant light to smite your enemies or heal your friends. Unholy creatures such as undead, ghosts and demons take aditional damage from the purity of your powers.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/holy_light
 */

import type { Powerset } from '@/types';

import { Rebuke as Rebuke } from './rebuke';
import { Admonish as Admonish } from './admonish';
import { Purify as Purify } from './purify';
import { Reckoning as Reckoning } from './reckoning';
import { Wrath as Wrath } from './wrath';
import { Radiance as Radiance } from './radiance';
import { Consecrate as Consecrate } from './consecrate';
import { MoteOfLight as MoteOfLight } from './mote-of-light';
import { Judgement as Judgement } from './judgement';

export const powerset: Powerset = {
  id: 'defender/radiant-blast',
  name: 'Radiant Blast',
  description: 'You Channel radiant light to smite your enemies or heal your friends. Unholy creatures such as undead, ghosts and demons take aditional damage from the purity of your powers.',
  icon: 'luminous_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Rebuke,
    Admonish,
    Purify,
    Reckoning,
    Wrath,
    Radiance,
    Consecrate,
    MoteOfLight,
    Judgement,
  ],
};

export default powerset;
