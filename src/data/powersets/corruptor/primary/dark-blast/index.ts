/**
 * Dark Blast Powerset
 * Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your target's chance to hit.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/dark_blast
 */

import type { Powerset } from '@/types';

import { Blackstar as Blackstar } from './blackstar';
import { DarkBlast as DarkBlast } from './dark-blast';
import { DarkPit as DarkPit } from './dark-pit';
import { Gloom as Gloom } from './gloom';
import { LifeDrain as LifeDrain } from './life-drain';
import { Moonbeam as Moonbeam } from './moonbeam';
import { NightFall as NightFall } from './night-fall';
import { TenebrousTentacles as TenebrousTentacles } from './tenebrous-tentacles';
import { Torrent as Torrent } from './torrent';

export const powerset: Powerset = {
  id: 'corruptor/dark-blast',
  name: 'Dark Blast',
  description: 'Dark Blast summons the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce your target\'s chance to hit.',
  icon: 'dark_blast_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Blackstar,
    DarkBlast,
    DarkPit,
    Gloom,
    LifeDrain,
    Moonbeam,
    NightFall,
    TenebrousTentacles,
    Torrent,
  ],
};

export default powerset;
