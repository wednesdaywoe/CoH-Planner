import type { Build } from '@/types';

/**
 * Powers consuming the level-up pick budget — the twin of `countPlacedBudgetSlots`
 * in `slot-levels.ts`, which does the same job for enhancement slots.
 *
 * Shared rather than reimplemented because two counts of "how many powers" that
 * disagree is worse than either being wrong alone: the Mids import summary used to
 * increment its own tally as it resolved entries, and reported 31 for a build the
 * dashboard then showed as 23 of 24 picks. It was counting inherent slot-data
 * entries, accolades and incarnate slots as powers, and entries that resolved but
 * were later dropped as duplicates. A count derived from the finished build cannot
 * drift from what the build holds.
 *
 * Auto-granted powers are excluded because they cost no pick: Kheldian and VEAT form
 * sub-powers live in the primary/secondary arrays but arrive with the parent.
 * Inherents are excluded for the same reason and are not in these arrays at all.
 */
export function countBudgetPowerPicks(
  build: Pick<Build, 'primary' | 'secondary' | 'pools' | 'epicPool'>,
): number {
  const picks = (powers: { isAutoGranted?: boolean }[]) =>
    powers.filter((p) => !p.isAutoGranted).length;

  return (
    picks(build.primary.powers) +
    picks(build.secondary.powers) +
    build.pools.reduce((sum, pool) => sum + picks(pool.powers), 0) +
    (build.epicPool ? picks(build.epicPool.powers) : 0)
  );
}
