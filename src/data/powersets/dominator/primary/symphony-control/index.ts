/**
 * Symphony Control Powerset
 * Use the power of music to captivate and control the spirits of your enemies. Most of your symphonic abilities influence the mind of your enemies, causing psionic damage.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/symphony_control
 */

import type { Powerset } from '@/types';

import { HymnofDissonance as HymnofDissonance } from './hymn-of-dissonance';
import { MelodicBinding as MelodicBinding } from './melodic-binding';
import { AriaofStasis as AriaofStasis } from './aria-of-stasis';
import { ImpassionedSerenade as ImpassionedSerenade } from './impassioned-serenade';
import { DreadfulDiscord as DreadfulDiscord } from './dreadful-discord';
import { EnfeeblingLullaby as EnfeeblingLullaby } from './enfeebling-lullaby';
import { ConfoundingChant as ConfoundingChant } from './confounding-chant';
import { ChordsofDespair as ChordsofDespair } from './chords-of-despair';
import { Reverberant as Reverberant } from './reverberant';

export const powerset: Powerset = {
  id: 'dominator/symphony-control',
  name: 'Symphony Control',
  description: 'Use the power of music to captivate and control the spirits of your enemies. Most of your symphonic abilities influence the mind of your enemies, causing psionic damage.',
  icon: 'siren_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    HymnofDissonance,
    MelodicBinding,
    AriaofStasis,
    ImpassionedSerenade,
    DreadfulDiscord,
    EnfeeblingLullaby,
    ConfoundingChant,
    ChordsofDespair,
    Reverberant,
  ],
};

export default powerset;
