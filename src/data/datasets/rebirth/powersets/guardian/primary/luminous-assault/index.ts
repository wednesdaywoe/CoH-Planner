/**
 * Luminous Assault Powerset
 * Masters of light, energy, and matter. Luminous Assault wielders can manipulate light energy to devastate their opponents. Luminous Assault bombards the foe with great force and power often knocking them down and reducing their defenses.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/luminous_assault
 */

import type { Powerset } from '@/types';

import { GleamingBolt as GleamingBolt } from './gleaming-bolt';
import { LuminousSmite as LuminousSmite } from './luminous-smite';
import { GlintingEye as GlintingEye } from './glinting-eye';
import { RadiantStrike as RadiantStrike } from './radiant-strike';
import { InnerLight as InnerLight } from './inner-light';
import { ProtonScatter as ProtonScatter } from './proton-scatter';
import { GleamingBlast as GleamingBlast } from './gleaming-blast';
import { IncandescentStrike as IncandescentStrike } from './incandescent-strike';
import { SolarFlare as SolarFlare } from './solar-flare';

export const powerset: Powerset = {
  id: 'guardian/luminous-assault',
  name: 'Luminous Assault',
  description: 'Masters of light, energy, and matter. Luminous Assault wielders can manipulate light energy to devastate their opponents. Luminous Assault bombards the foe with great force and power often knocking them down and reducing their defenses.',
  icon: 'luminous_blast_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    GleamingBolt,
    LuminousSmite,
    GlintingEye,
    RadiantStrike,
    InnerLight,
    ProtonScatter,
    GleamingBlast,
    IncandescentStrike,
    SolarFlare,
  ],
};

export default powerset;
