/**
 * Dull Pain — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs guardian_comp reconstructive_healing
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { DullPain as base } from '@/data/datasets/rebirth/generated/powersets/guardian/secondary/reconstructive-healing/dull-pain';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/guardian/secondary/reconstructive-healing/dull-pain';

export const DullPain: Power = withOverrides(base, overrides);
