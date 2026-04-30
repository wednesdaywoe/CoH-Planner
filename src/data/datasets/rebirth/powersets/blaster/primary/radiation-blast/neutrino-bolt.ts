/**
 * Neutrino Bolt — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs blaster_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { NeutrinoBolt as base } from '@/data/datasets/rebirth/generated/powersets/blaster/primary/radiation-blast/neutrino-bolt';
import { overrides } from '@/data/datasets/rebirth/overrides/powersets/blaster/primary/radiation-blast/neutrino-bolt';

export const NeutrinoBolt: Power = withOverrides(base, overrides);
