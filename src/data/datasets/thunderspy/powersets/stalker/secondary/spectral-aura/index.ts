/**
 * Spectral Aura Powerset
 * Spectral Aura allows you to step between the veil of life and death to protect yourself and hinder your Foes.  Many Spectral Aura powers cause additional effects when used on feared foes.
 *
 * Archetype: stalker
 * Category: secondary
 * Source: stalker_defense/spectral_aura
 */

import type { Powerset } from '@/types';

import { ApparitionalAvoidance as ApparitionalAvoidance } from './apparitional-avoidance';
import { EtherealElusion as EtherealElusion } from './ethereal-elusion';
import { PhantasmalPhase as PhantasmalPhase } from './phantasmal-phase';
import { VisionsOfTheEnd as VisionsOfTheEnd } from './visions-of-the-end';
import { Convalesce as Convalesce } from './convalesce';
import { FrighteningFade as FrighteningFade } from './frightening-fade';
import { HauntingHaze as HauntingHaze } from './haunting-haze';
import { Hide as Hide } from './hide';
import { BeyondTheVeilAlive as BeyondTheVeilAlive } from './beyond-the-veil-alive';

export const powerset: Powerset = {
  id: 'stalker/spectral-aura',
  setPath: 'Stalker_Defense.Spectral_Aura',
  name: 'Spectral Aura',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Spectral Aura allows you to step between the veil of life and death to protect yourself and hinder your Foes.  Many Spectral Aura powers cause additional effects when used on feared foes.",
  icon: 'dark_armor_set.ico',
  archetype: 'stalker',
  category: 'secondary',
  powers: [
    ApparitionalAvoidance,
    EtherealElusion,
    PhantasmalPhase,
    VisionsOfTheEnd,
    Convalesce,
    FrighteningFade,
    HauntingHaze,
    Hide,
    BeyondTheVeilAlive,
  ],
};

export default powerset;
