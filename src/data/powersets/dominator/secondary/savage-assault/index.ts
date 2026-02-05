/**
 * Savage Assault Powerset
 * Command wild animals and Tear at your foes with your own animalistic attacks that primarily inflict Lethal damage and cause additional damage over time. Call Swarm, Maiming Slash, Vicious Slash, Unkindness and Feral Charge all grant stacks of Blood Frenzy. Each stack of this buff grants a small recharge buff and endurance cost discount. You may have up to 5 stacks of Blood Frenzy active at a time. Blood Frenzy can be maintained, or it can be consumed to empower Rending Flurry and Call Hawk. Using one of these consumers while you have 5 stacks of Blood Frenzy offers an additional benefit to these powers, but will also leave you Exhausted for a short time. While Exhausted you cannot build Blood Frenzy.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/savage_assault
 */

import type { Powerset } from '@/types';

import { CallSwarm as CallSwarm } from './call-swarm';
import { MaimingSlash as MaimingSlash } from './maiming-slash';
import { ViciousSlash as ViciousSlash } from './vicious-slash';
import { Unkindness as Unkindness } from './unkindness';
import { SpotPrey as SpotPrey } from './spot-prey';
import { RendingFlurry as RendingFlurry } from './rending-flurry';
import { BloodCraze as BloodCraze } from './blood-craze';
import { CallHawk as CallHawk } from './call-hawk';
import { FeralCharge as FeralCharge } from './feral-charge';

export const powerset: Powerset = {
  id: 'dominator/savage-assault',
  name: 'Savage Assault',
  description: 'Command wild animals and Tear at your foes with your own animalistic attacks that primarily inflict Lethal damage and cause additional damage over time. Call Swarm, Maiming Slash, Vicious Slash, Unkindness and Feral Charge all grant stacks of Blood Frenzy. Each stack of this buff grants a small recharge buff and endurance cost discount. You may have up to 5 stacks of Blood Frenzy active at a time. Blood Frenzy can be maintained, or it can be consumed to empower Rending Flurry and Call Hawk. Using one of these consumers while you have 5 stacks of Blood Frenzy offers an additional benefit to these powers, but will also leave you Exhausted for a short time. While Exhausted you cannot build Blood Frenzy.',
  icon: 'savage_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    CallSwarm,
    MaimingSlash,
    ViciousSlash,
    Unkindness,
    SpotPrey,
    RendingFlurry,
    BloodCraze,
    CallHawk,
    FeralCharge,
  ],
};

export default powerset;
