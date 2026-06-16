/**
 * Suspension Bubble — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_buff force_field
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { SuspensionBubble as base } from '@/data/datasets/thunderspy/generated/powersets/defender/primary/force-field/suspension-bubble';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/defender/primary/force-field/suspension-bubble';

export const SuspensionBubble: Power = withOverrides(base, overrides);
