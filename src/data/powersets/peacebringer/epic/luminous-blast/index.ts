/**
 * Luminous Blast Powerset
 * Masters of light, energy and matter, Peacebringers can manipulate Kheldian Light Energy to devastate their opponents. Their Luminous Blasts bombard their foes with awesome power that often knock down foes and can easily reduce a target's defenses.
 *
 * Archetype: peacebringer
 * Category: epic
 * Source: peacebringer_offensive/luminous_blast
 */

import type { Powerset } from '@/types';

import { GleamingBolt as GleamingBolt } from './gleaming-bolt';
import { GlintingEye as GlintingEye } from './glinting-eye';
import { GleamingBlast as GleamingBlast } from './gleaming-blast';
import { BrightNova as BrightNova } from './bright-nova';
import { BrightNovaBolt as BrightNovaBolt } from './bright-nova-bolt';
import { BrightNovaBlast as BrightNovaBlast } from './bright-nova-blast';
import { BrightNovaScatter as BrightNovaScatter } from './bright-nova-scatter';
import { BrightNovaDetonation as BrightNovaDetonation } from './bright-nova-detonation';
import { RadiantStrike as RadiantStrike } from './radiant-strike';
import { ProtonScatter as ProtonScatter } from './proton-scatter';
import { InnerLight as InnerLight } from './build-up';
import { LuminousDetonation as LuminousDetonation } from './luminous-detonation';
import { IncandescentStrike as IncandescentStrike } from './incandescent-strike';
import { Pulsar as Pulsar } from './pulsar';
import { GlowingTouch as GlowingTouch } from './glowing-touch';
import { SolarFlare as SolarFlare } from './solar-flare';
import { PhotonSeekers as PhotonSeekers } from './photon-seekers';
import { DawnStrike as DawnStrike } from './dawn-strike';

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
