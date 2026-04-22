/**
 * Symphony Control Powerset
 * Use the power of music to captivate and control the spirits of your enemies. Most of your symphonic abilities influence the mind of your enemies, causing psionic damage.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/symphony_control
 */

import type { Powerset } from '@/types';

import { AriaofStasis as AriaofStasis } from './aria-of-stasis';
import { ChordsofDespair as ChordsofDespair } from './chords-of-despair';
import { ConfoundingChant as ConfoundingChant } from './confounding-chant';
import { DreadfulDiscord as DreadfulDiscord } from './dreadful-discord';
import { EnfeeblingLullaby as EnfeeblingLullaby } from './enfeebling-lullaby';
import { HymnofDissonance as HymnofDissonance } from './hymn-of-dissonance';
import { ImpassionedSerenade as ImpassionedSerenade } from './impassioned-serenade';
import { MelodicBinding as MelodicBinding } from './melodic-binding';
import { Reverberant as Reverberant } from './reverberant';

export const powerset: Powerset = {
  id: 'controller/symphony-control',
  name: 'Symphony Control',
  description: 'Use the power of music to captivate and control the spirits of your enemies. Most of your symphonic abilities influence the mind of your enemies, causing psionic damage.',
  icon: 'siren_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    AriaofStasis,
    ChordsofDespair,
    ConfoundingChant,
    DreadfulDiscord,
    EnfeeblingLullaby,
    HymnofDissonance,
    ImpassionedSerenade,
    MelodicBinding,
    Reverberant,
  ],
};

export default powerset;
