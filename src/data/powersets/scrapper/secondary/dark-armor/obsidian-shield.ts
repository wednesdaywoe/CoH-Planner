/**
 * Obsidian Shield — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs scrapper_defense dark_armor
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ObsidianShield as base } from '@/data/generated/powersets/scrapper/secondary/dark-armor/obsidian-shield';
import { overrides } from '@/data/overrides/powersets/scrapper/secondary/dark-armor/obsidian-shield';

export const ObsidianShield: Power = withOverrides(base, overrides);
