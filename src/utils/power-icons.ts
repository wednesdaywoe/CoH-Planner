/**
 * Unified power icon path resolution.
 *
 * All power icons (primary, secondary, pool, epic, inherent, incarnate)
 * live in a single flat folder: /img/powers/
 */

import { resolvePath } from '@/utils/paths';

/**
 * Get the full icon path for any power icon.
 *
 * @param iconFilename The bare icon filename (e.g., "fireblast_fireblast.png")
 * @returns Full resolved path (e.g., "/CoH-Planner/img/powers/fireblast_fireblast.png")
 */
export function getPowerIconPath(iconFilename: string | undefined): string {
  if (!iconFilename) {
    return resolvePath('/img/Unknown.png');
  }
  return resolvePath(`/img/powers/${iconFilename.toLowerCase()}`);
}
