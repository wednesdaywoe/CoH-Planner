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
import { BlackDwarf as BlackDwarf } from './black-dwarf';
import { BlackDwarfAntagonize as BlackDwarfAntagonize } from './black-dwarf-antagonize';
import { BlackDwarfDrain as BlackDwarfDrain } from './black-dwarf-drain';
import { BlackDwarfMire as BlackDwarfMire } from './black-dwarf-mire';
import { BlackDwarfSmite as BlackDwarfSmite } from './black-dwarf-smite';
import { BlackDwarfStep as BlackDwarfStep } from './black-dwarf-step';
import { BlackDwarfStrike as BlackDwarfStrike } from './black-dwarf-strike';
import { Eclipse as Eclipse } from './eclipse';
import { GravityShield as GravityShield } from './gravity-shield';
import { InkyAspect as InkyAspect } from './inky-aspect';
import { NebulousForm as NebulousForm } from './nebulous-form';
import { OrbitingDeath as OrbitingDeath } from './orbiting-death';
import { PenumbralShield as PenumbralShield } from './penumbral-shield';
import { ShadowCloak as ShadowCloak } from './shadow-cloak';
import { ShadowRecall as ShadowRecall } from './shadow-recall';
import { ShadowSlip as ShadowSlip } from './shadow-slip';
import { ShadowStep as ShadowStep } from './shadow-step';
import { StygianCircle as StygianCircle } from './stygian-circle';
import { StygianReturn as StygianReturn } from './stygian-return';
import { TwilightShield as TwilightShield } from './twilight-shield';

export const powerset: Powerset = {
  id: 'warshade/umbral-aura',
  name: 'Umbral Aura',
  description: 'Warshades can generate Dark Fields to give themselves incredible defensive capabilities.',
  icon: 'umbral_aura_set.ico',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    Absorption,
    BlackDwarf,
    BlackDwarfAntagonize,
    BlackDwarfDrain,
    BlackDwarfMire,
    BlackDwarfSmite,
    BlackDwarfStep,
    BlackDwarfStrike,
    Eclipse,
    GravityShield,
    InkyAspect,
    NebulousForm,
    OrbitingDeath,
    PenumbralShield,
    ShadowCloak,
    ShadowRecall,
    ShadowSlip,
    ShadowStep,
    StygianCircle,
    StygianReturn,
    TwilightShield,
  ],
};

export default powerset;
