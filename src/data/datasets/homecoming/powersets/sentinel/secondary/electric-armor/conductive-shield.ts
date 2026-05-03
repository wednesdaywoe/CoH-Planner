/**
 * Conductive Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs sentinel_defense electric_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ConductiveShield as base } from '@/data/datasets/homecoming/generated/powersets/sentinel/secondary/electric-armor/conductive-shield';
import { overrides } from '@/data/datasets/homecoming/overrides/powersets/sentinel/secondary/electric-armor/conductive-shield';

export const ConductiveShield: Power = withOverrides(base, overrides);
