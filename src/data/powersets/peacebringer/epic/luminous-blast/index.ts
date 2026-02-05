/**
 * Luminous Blast Powerset
 * Masters of light, energy and matter, Peacebringers can manipulate Kheldian Light Energy to devastate their opponents. Their Luminous Blasts bombard their foes with awesome power that often knock down foes and can easily reduce a target's defenses.
 *
 * Archetype: peacebringer
 * Category: Epic
 */

import type { Powerset } from '@/types';

import { GleamingBolt } from './gleaming-bolt';
import { GlintingEye } from './glinting-eye';
import { GleamingBlast } from './gleaming-blast';
import { BrightNova } from './bright-nova';
import { BrightNovaBolt } from './bright-nova-bolt';
import { BrightNovaBlast } from './bright-nova-blast';
import { BrightNovaScatter } from './bright-nova-scatter';
import { BrightNovaDetonation } from './bright-nova-detonation';
import { RadiantStrike } from './radiant-strike';
import { ProtonScatter } from './proton-scatter';
import { InnerLight } from './inner-light';
import { LuminousDetonation } from './luminous-detonation';
import { IncandescentStrike } from './incandescent-strike';
import { Pulsar } from './pulsar';
import { GlowingTouch } from './glowing-touch';
import { SolarFlare } from './solar-flare';
import { PhotonSeekers } from './photon-seekers';
import { DawnStrike } from './dawn-strike';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-blast',
  name: 'Luminous Blast',
  description: 'Masters of light, energy and matter, Peacebringers can manipulate Kheldian Light Energy to devastate their opponents. Their Luminous Blasts bombard their foes with awesome power that often knock down foes and can easily reduce a target\'s defenses.',
  icon: 'luminous_blast_set.png',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    GleamingBolt,
    GlintingEye,
    GleamingBlast,
    BrightNova,
    BrightNovaBolt,
    BrightNovaBlast,
    BrightNovaScatter,
    BrightNovaDetonation,
    RadiantStrike,
    ProtonScatter,
    InnerLight,
    LuminousDetonation,
    IncandescentStrike,
    Pulsar,
    GlowingTouch,
    SolarFlare,
    PhotonSeekers,
    DawnStrike,
  ],
};

export default powerset;
