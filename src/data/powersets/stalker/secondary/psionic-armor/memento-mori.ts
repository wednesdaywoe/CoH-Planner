/**
 * Memento Mori — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs stalker_defense psionic_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { MementoMori as base } from '@/data/generated/powersets/stalker/secondary/psionic-armor/memento-mori';
import { overrides } from '@/data/overrides/powersets/stalker/secondary/psionic-armor/memento-mori';

export const MementoMori: Power = withOverrides(base, overrides);
