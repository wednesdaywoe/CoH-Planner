/**
 * Abyssal Gaze — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_ranged dark_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { AbyssalGaze as base } from '@/data/generated/powersets/sentinel/primary/dark-blast/abyssal-gaze';
import { overrides } from '@/data/overrides/powersets/sentinel/primary/dark-blast/abyssal-gaze';

export const AbyssalGaze: Power = withOverrides(base, overrides);
