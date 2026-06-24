/**
 * Astral Control Powerset
 * You walk the realm somewhere between reality and dreams, wielding a mix of Psionic and Negative Energy powers that are half real and half imagined.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/quoastral_control
 */

import type { Powerset } from '@/types';

import { Delirium as Delirium } from './delirium';
import { GleamingColumn as GleamingColumn } from './gleaming-column';
import { AstonishingLight as AstonishingLight } from './astonishing-light';
import { AstralGolem as AstralGolem } from './astral-golem';
import { Ambiguity as Ambiguity } from './ambiguity';
import { SubliminalAura as SubliminalAura } from './subliminal-aura';
import { StrangeGate as StrangeGate } from './strange-gate';
import { SpiritualDawn as SpiritualDawn } from './spiritual-dawn';
import { LucidDream as LucidDream } from './lucid-dream';

export const powerset: Powerset = {
  id: 'controller/astral-control',
  name: 'Astral Control',
  description: 'You walk the realm somewhere between reality and dreams, wielding a mix of Psionic and Negative Energy powers that are half real and half imagined.',
  icon: 'darkness_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Delirium,
    GleamingColumn,
    AstonishingLight,
    AstralGolem,
    Ambiguity,
    SubliminalAura,
    StrangeGate,
    SpiritualDawn,
    LucidDream,
  ],
};

export default powerset;
