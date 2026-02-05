/**
 * Marine Affinity Powerset
 * Command the various powers of the ocean to buff your allies, and wash away your enemies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/marine_affinity
 */

import type { Powerset } from '@/types';

import { ShoalRush as ShoalRush } from './shoal-rush';
import { SoothingWave as SoothingWave } from './soothing-wave';
import { ToroidalBubble as ToroidalBubble } from './toroidal-bubble';
import { Whitecap as Whitecap } from './whitecap';
import { TidePool as TidePool } from './tide-pool';
import { Brine as Brine } from './brine';
import { ShiftingTides as ShiftingTides } from './shifting-tides';
import { BarrierReef as BarrierReef } from './barrier-reef';
import { PoweroftheDepths as PoweroftheDepths } from './power-of-the-depths';

export const powerset: Powerset = {
  id: 'mastermind/marine-affinity',
  name: 'Marine Affinity',
  description: 'Command the various powers of the ocean to buff your allies, and wash away your enemies.',
  icon: 'nature_affinity_set.png',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    ShoalRush,
    SoothingWave,
    ToroidalBubble,
    Whitecap,
    TidePool,
    Brine,
    ShiftingTides,
    BarrierReef,
    PoweroftheDepths,
  ],
};

export default powerset;
