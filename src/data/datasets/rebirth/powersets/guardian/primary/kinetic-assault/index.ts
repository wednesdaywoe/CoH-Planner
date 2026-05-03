/**
 * Kinetic Assault Powerset
 * Through manipulation of latent energy present all around you, you create powerful blasts and forceful blows that can prove devastating to your opponents. As you manipulate this energy, you will accumulate Impulse. Each stack of Impulse grants you a scaling recharge buff. Impulse is also used to empower Disrupting Torrent, Kinetic Shockwave, Energetic Strike and Mass Driver.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/kinetic_assault
 */

import type { Powerset } from '@/types';

import { KineticBolt as KineticBolt } from './kinetic-bolt';
import { ForcefulBlow as ForcefulBlow } from './forceful-blow';
import { CrushingBlast as CrushingBlast } from './crushing-blast';
import { DisruptingTorrent as DisruptingTorrent } from './disrupting-torrent';
import { Coalescence as Coalescence } from './coalescence';
import { KineticShockwave as KineticShockwave } from './kinetic-shockwave';
import { EnergeticStrike as EnergeticStrike } from './energetic-strike';
import { KineticLance as KineticLance } from './kinetic-lance';
import { MassDriver as MassDriver } from './mass-driver';

export const powerset: Powerset = {
  id: 'guardian/kinetic-assault',
  name: 'Kinetic Assault',
  description: 'Through manipulation of latent energy present all around you, you create powerful blasts and forceful blows that can prove devastating to your opponents. As you manipulate this energy, you will accumulate Impulse. Each stack of Impulse grants you a scaling recharge buff. Impulse is also used to empower Disrupting Torrent, Kinetic Shockwave, Energetic Strike and Mass Driver.',
  icon: 'kinetic_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    KineticBolt,
    ForcefulBlow,
    CrushingBlast,
    DisruptingTorrent,
    Coalescence,
    KineticShockwave,
    EnergeticStrike,
    KineticLance,
    MassDriver,
  ],
};

export default powerset;
