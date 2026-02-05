/**
 * Umbral Aura Powerset
 * Warshades can generate Dark Fields to give themselves incredible defensive capabilities.
 *
 * Archetype: warshade
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { Absorption } from './absorption';
import { GravityShield } from './gravity-shield';
import { OrbitingDeath } from './orbiting-death';
import { PenumbralShield } from './penumbral-shield';
import { ShadowRecall } from './shadow-recall';
import { ShadowCloak } from './shadow-cloak';
import { TwilightShield } from './twilight-shield';
import { BlackDwarf } from './black-dwarf';
import { BlackDwarfStrike } from './black-dwarf-strike';
import { BlackDwarfSmite } from './black-dwarf-smite';
import { BlackDwarfDrain } from './black-dwarf-drain';
import { BlackDwarfMire } from './black-dwarf-mire';
import { BlackDwarfStep } from './black-dwarf-step';
import { BlackDwarfAntagonize } from './black-dwarf-antagonize';
import { StygianCircle } from './stygian-circle';
import { NebulousForm } from './nebulous-form';
import { ShadowSlip } from './shadow-slip';
import { InkyAspect } from './inky-aspect';
import { StygianReturn } from './stygian-return';
import { Eclipse } from './eclipse';

export const powerset: Powerset = {
  id: 'warshade/umbral-aura',
  name: 'Umbral Aura',
  description: 'Warshades can generate Dark Fields to give themselves incredible defensive capabilities.',
  icon: 'umbral_aura_set.png',
  archetype: 'warshade',
  category: 'epic',
  powers: [
    Absorption,
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
