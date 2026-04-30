/**
 * Tar Patch — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs controller_buff darkness_affinity
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { TarPatch as base } from '@/data/datasets/rebirth/generated/powersets/controller/secondary/darkness-affinity/tar-patch';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/controller/secondary/darkness-affinity/tar-patch';

export const TarPatch: Power = withOverrides(base, overrides);
