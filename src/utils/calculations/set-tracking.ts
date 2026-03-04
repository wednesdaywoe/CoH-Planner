/**
 * Set tracking utility — computes which IO set pieces are slotted across a build.
 * Extracted from buildStore so it can be used for hypothetical build calculations.
 */

import type { Build, SetTracking, Enhancement } from '@/types';

/**
 * Compute IO set tracking from a build's enhancement slots.
 * Returns a map of setId → { count, pieces } for all slotted IO sets.
 */
export function computeSetTracking(build: Build): Record<string, SetTracking> {
  const sets: Record<string, SetTracking> = {};

  const processSlots = (slots: (Enhancement | null)[]) => {
    for (const enh of slots) {
      if (enh && enh.type === 'io-set') {
        const setId = (enh as { setId: string }).setId;
        const pieceNum = (enh as { pieceNum: number }).pieceNum;

        if (!sets[setId]) {
          sets[setId] = { count: 0, pieces: new Set() };
        }

        if (!sets[setId].pieces.has(pieceNum)) {
          sets[setId].pieces.add(pieceNum);
          sets[setId].count++;
        }
      }
    }
  };

  // Process all power categories
  build.primary.powers.forEach((p) => processSlots(p.slots));
  build.secondary.powers.forEach((p) => processSlots(p.slots));
  build.pools.forEach((pool) => pool.powers.forEach((p) => processSlots(p.slots)));
  if (build.epicPool) {
    build.epicPool.powers.forEach((p) => processSlots(p.slots));
  }
  build.inherents.forEach((p) => processSlots(p.slots));

  return sets;
}
