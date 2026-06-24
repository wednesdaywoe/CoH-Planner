/**
 * Umbral Aura Powerset
 * Warshades can generate Dark Fields to give themselves incredible defensive capabilities.
 *
 * Archetype: warshade
 * Category: epic
 * Source: warshade_defensive/umbral_aura
 */

import type { Powerset } from '@/types';

import { Absorption as Absorption } from './absorption';
import { ShadowStep as ShadowStep } from './shadow-step';
import { GravityShield as GravityShield } from './gravity-shield';
import { OrbitingDeath as OrbitingDeath } from './orbiting-death';
import { ShadowRecall as ShadowRecall } from './shadow-recall';
import { PenumbralShield as PenumbralShield } from './penumbral-shield';
import { ShadowCloak as ShadowCloak } from './shadow-cloak';
import { TwilightShield as TwilightShield } from './twilight-shield';
import { BlackDwarf as BlackDwarf } from './black-dwarf';
import { StygianCircle as StygianCircle } from './stygian-circle';
import { NebulousForm as NebulousForm } from './nebulous-form';
import { UmbralEssenceBifurcation as UmbralEssenceBifurcation } from './umbral-essence-bifurcation';
import { InkyAspect as InkyAspect } from './inky-aspect';
import { StygianReturn as StygianReturn } from './stygian-return';
import { Eclipse as Eclipse } from './eclipse';

export const powerset: Powerset = {
  id: 'warshade/umbral-aura',
  name: 'Umbral Aura',
  description: 'Warshades can generate Dark Fields to give themselves incredible defensive capabilities.',
  icon: 'umbral_aura_set.ico',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    Absorption,
    ShadowStep,
    GravityShield,
    OrbitingDeath,
    ShadowRecall,
    PenumbralShield,
    ShadowCloak,
    TwilightShield,
    BlackDwarf,
    StygianCircle,
    NebulousForm,
    UmbralEssenceBifurcation,
    InkyAspect,
    StygianReturn,
    Eclipse,
  ],
};

export default powerset;
