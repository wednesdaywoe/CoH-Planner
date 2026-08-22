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
import { GravityShield as GravityShield } from './gravity-shield';
import { OrbitingDeath as OrbitingDeath } from './orbiting-death';
import { PenumbralShield as PenumbralShield } from './penumbral-shield';
import { ShadowCloak as ShadowCloak } from './shadow-cloak';
import { TwilightShield as TwilightShield } from './twilight-shield';
import { BlackDwarf as BlackDwarf } from './black-dwarf';
import { StygianCircle as StygianCircle } from './stygian-circle';
import { NebulousForm as NebulousForm } from './nebulous-form';
import { InkyAspect as InkyAspect } from './inky-aspect';
import { StygianReturn as StygianReturn } from './stygian-return';
import { Eclipse as Eclipse } from './eclipse';

export const powerset: Powerset = {
  id: 'warshade/umbral-aura',
  setPath: 'Warshade_Defensive.Umbral_Aura',
  name: 'Umbral Aura',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Warshades can generate Dark Fields to give themselves incredible defensive capabilities.",
  icon: 'umbral_aura_set.ico',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    Absorption,
    GravityShield,
    OrbitingDeath,
    PenumbralShield,
    ShadowCloak,
    TwilightShield,
    BlackDwarf,
    StygianCircle,
    NebulousForm,
    InkyAspect,
    StygianReturn,
    Eclipse,
  ],
};

export default powerset;
