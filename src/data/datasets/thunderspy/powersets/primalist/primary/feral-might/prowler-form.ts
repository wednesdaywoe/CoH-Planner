/**
 * Prowler Form — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs feral_might feral_might
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ProwlerForm as base } from '@/data/datasets/thunderspy/generated/powersets/primalist/primary/feral-might/prowler-form';
import { overrides } from '@/data/datasets/thunderspy/overrides/powersets/primalist/primary/feral-might/prowler-form';

export const ProwlerForm: Power = withOverrides(base, overrides);
