/**
 * Nebulous Form — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "You can Phase Shift to become out of sync with normal space. Although you do not become completely Invisible, you are translucent and hard to see. You are intangible, and cannot affect or be affected by those in normal space. Even gravity has a weak hold on you. You can jump great distances while in Nebulous Form. However, after 30 seconds the phase out effect will wear off. 30 seconds later, if this power is still active the user will become phased out once again. Cannot be used with Rest.  Nebulous Form can be active at the same time as other jumping toggles, but only the strongest jump buff will apply.  Recharge: Slow."
};
