/**
 * Mask Presence — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs teamwork fortunata_teamwork
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MaskPresence as base } from '@/data/datasets/rebirth/generated/powersets/arachnos-widow/epic/fortunata-teamwork/frt-mask-presence';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/arachnos-widow/epic/fortunata-teamwork/frt-mask-presence';

export const MaskPresence: Power = withOverrides(base, overrides);
