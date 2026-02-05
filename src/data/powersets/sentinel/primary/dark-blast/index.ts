/**
 * Dark Blast Powerset
 * Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets' chance to hit.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/dark_blast
 */

import type { Powerset } from '@/types';

import { DarkBlast as DarkBlast } from './dark-blast';
import { Gloom as Gloom } from './gloom';
import { UmbralTorrent as UmbralTorrent } from './umbral-torrent';
import { AbyssalGaze as AbyssalGaze } from './abyssal-gaze';
import { Aim as Aim } from './aim';
import { DarkObliteration as DarkObliteration } from './dark-obliteration';
import { AntumbralBeam as AntumbralBeam } from './antumbral-beam';
import { LifeDrain as LifeDrain } from './life-drain';
import { Blackstar as Blackstar } from './blackstar';

export const powerset: Powerset = {
  id: 'sentinel/dark-blast',
  name: 'Dark Blast',
  description: 'Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your targets\' chance to hit.',
  icon: 'dark_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    DarkBlast,
    Gloom,
    UmbralTorrent,
    AbyssalGaze,
    Aim,
    DarkObliteration,
    AntumbralBeam,
    LifeDrain,
    Blackstar,
  ],
};

export default powerset;
