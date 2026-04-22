/**
 * Luminous Blast Powerset
 * Masters of light, energy and matter, Peacebringers can manipulate Kheldian Light Energy to devastate their opponents. Their Luminous Blasts bombard their foes with awesome power that often knock down foes and can easily reduce a target's defenses.
 *
 * Archetype: peacebringer
 * Category: epic
 * Source: peacebringer_offensive/luminous_blast
 */

import type { Powerset } from '@/types';

import { BrightNova as BrightNova } from './bright-nova';
import { BrightNovaBlast as BrightNovaBlast } from './bright-nova-blast';
import { BrightNovaBolt as BrightNovaBolt } from './bright-nova-bolt';
import { BrightNovaDetonation as BrightNovaDetonation } from './bright-nova-detonation';
import { BrightNovaScatter as BrightNovaScatter } from './bright-nova-scatter';
import { InnerLight as InnerLight } from './build-up';
import { DawnStrike as DawnStrike } from './dawn-strike';
import { GleamingBlast as GleamingBlast } from './gleaming-blast';
import { GleamingBolt as GleamingBolt } from './gleaming-bolt';
import { GlintingEye as GlintingEye } from './glinting-eye';
import { GlowingTouch as GlowingTouch } from './glowing-touch';
import { IncandescentStrike as IncandescentStrike } from './incandescent-strike';
import { LuminousDetonation as LuminousDetonation } from './luminous-detonation';
import { PhotonSeekers as PhotonSeekers } from './photon-seekers';
import { ProtonScatter as ProtonScatter } from './proton-scatter';
import { Pulsar as Pulsar } from './pulsar';
import { RadiantStrike as RadiantStrike } from './radiant-strike';
import { SolarFlare as SolarFlare } from './solar-flare';

export const powerset: Powerset = {
  id: 'peacebringer/luminous-blast',
  name: 'Luminous Blast',
  description: 'Masters of light, energy and matter, Peacebringers can manipulate Kheldian Light Energy to devastate their opponents. Their Luminous Blasts bombard their foes with awesome power that often knock down foes and can easily reduce a target\'s defenses.',
  icon: 'luminous_blast_set.ico',
  archetype: 'peacebringer',
  category: 'epic',
  powers: [
    BrightNova,
    BrightNovaBlast,
    BrightNovaBolt,
    BrightNovaDetonation,
    BrightNovaScatter,
    InnerLight,
    DawnStrike,
    GleamingBlast,
    GleamingBolt,
    GlintingEye,
    GlowingTouch,
    IncandescentStrike,
    LuminousDetonation,
    PhotonSeekers,
    ProtonScatter,
    Pulsar,
    RadiantStrike,
    SolarFlare,
  ],
};

export default powerset;
