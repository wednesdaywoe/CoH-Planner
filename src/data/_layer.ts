/**
 * Composition helper for the generated/overrides power layering.
 *
 * Generated layer (src/data/generated/) is a pristine extraction —
 * never hand-edited, freely overwritten by `scripts/convert-powerset.cjs`.
 * Override layer (src/data/overrides/) holds hand-written deltas that
 * survive regeneration: display-name corrections, AT-specific level
 * adjustments, planner-only fields like `maxStacks` / `stacksLinear`.
 *
 * Composed files in src/data/powersets/ apply overrides on top of the
 * generated power via `withOverrides(base, overrides)` — a shallow
 * top-level merge with explicit deep-merge for nested object fields
 * the planner uses (effects, stats). Arrays are not deep-merged —
 * provide them in full from the override side when you need to change
 * one (this matches the planner's read semantics; replacing an array
 * is the safer default than splicing).
 */
import type { Power } from '@/types';

const NESTED_OBJECT_FIELDS = ['effects', 'stats'] as const;

export function withOverrides(base: Power, overrides?: Partial<Power>): Power {
  if (!overrides) return base;
  const out: Power = { ...base, ...overrides };
  for (const key of NESTED_OBJECT_FIELDS) {
    const baseVal = base[key] as object | undefined;
    const overrideVal = overrides[key] as object | undefined;
    if (baseVal && overrideVal && typeof baseVal === 'object' && typeof overrideVal === 'object'
        && !Array.isArray(baseVal) && !Array.isArray(overrideVal)) {
      (out as unknown as Record<string, unknown>)[key] = { ...baseVal, ...overrideVal };
    }
  }
  return out;
}
