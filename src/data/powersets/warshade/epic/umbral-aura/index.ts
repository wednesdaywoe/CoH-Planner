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
import { PenumbralShield as PenumbralShield } from './penumbral-shield';
import { ShadowRecall as ShadowRecall } from './shadow-recall';
import { ShadowCloak as ShadowCloak } from './shadow-cloak';
import { TwilightShield as TwilightShield } from './twilight-shield';
import { BlackDwarf as BlackDwarf } from './black-dwarf';
import { BlackDwarfStrike as BlackDwarfStrike } from './black-dwarf-strike';
import { BlackDwarfSmite as BlackDwarfSmite } from './black-dwarf-smite';
import { BlackDwarfDrain as BlackDwarfDrain } from './black-dwarf-drain';
import { BlackDwarfMire as BlackDwarfMire } from './black-dwarf-mire';
import { BlackDwarfStep as BlackDwarfStep } from './black-dwarf-step';
import { BlackDwarfAntagonize as BlackDwarfAntagonize } from './black-dwarf-antagonize';
import { StygianCircle as StygianCircle } from './stygian-circle';
import { NebulousForm as NebulousForm } from './nebulous-form';
import { ShadowSlip as ShadowSlip } from './shadow-slip';
import { InkyAspect as InkyAspect } from './inky-aspect';
import { StygianReturn as StygianReturn } from './stygian-return';
import { Eclipse as Eclipse } from './eclipse';

export const powerset: Powerset = {
  id: 'warshade/umbral-aura',
  name: 'Umbral Aura',
  description: 'Warshades can generate Dark Fields to give themselves incredible defensive capabilities.',
  icon: 'umbral_aura_set.png',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    Absorption,
    ShadowStep,
    GravityShield,
    OrbitingDeath,
    PenumbralShield,
    ShadowRecall,
    ShadowCloak,
    TwilightShield,
    BlackDwarf,
    BlackDwarfStrike,
    BlackDwarfSmite,
    BlackDwarfDrain,
    BlackDwarfMire,
    BlackDwarfStep,
    BlackDwarfAntagonize,
    StygianCircle,
    NebulousForm,
    ShadowSlip,
    InkyAspect,
    StygianReturn,
    Eclipse,
  ],
};

export default powerset;
