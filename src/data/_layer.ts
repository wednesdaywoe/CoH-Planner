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

/**
 * Walk an aggregate generated-data tree (Epic or Pool pools) and apply
 * per-power overrides keyed by the power's `fullName`. Shape:
 *
 *   data:      Record<poolId, { powers: PowerLike[], ...poolMeta }>
 *   overrides: Record<powerFullName, Partial<Power>>
 *
 * Returns a new tree with matched powers wrapped via `withOverrides`.
 * Pools and metadata aren't cloned unless they contain an override; this
 * keeps object identity stable for unrelated pools.
 *
 * The aggregate scripts (convert-epic-pools, convert-pool-powers) emit
 * power objects whose shape doesn't strictly match the `Power` type
 * imported by the planner — they have a few extra fields (`fullName`,
 * `rank`) and are missing some `Power` fields (no `internalName`). We
 * use a loose `Record<string, unknown>`-like constraint to accept them
 * and rely on `withOverrides` operating on whichever fields are present.
 */
export function applyAggregateOverrides<T extends { powers: Array<Record<string, unknown> & { fullName?: string }> }>(
  data: Record<string, T>,
  overrides: Record<string, Partial<Power>>,
): Record<string, T> {
  const overrideKeys = Object.keys(overrides);
  if (overrideKeys.length === 0) return data;
  const out: Record<string, T> = {};
  for (const [poolId, pool] of Object.entries(data)) {
    const matched = pool.powers.filter(p => p.fullName && overrides[p.fullName]);
    if (matched.length === 0) {
      out[poolId] = pool;
      continue;
    }
    const nextPowers = pool.powers.map(p => {
      const o = p.fullName ? overrides[p.fullName] : undefined;
      return o ? (withOverrides(p as unknown as Power, o) as unknown as typeof p) : p;
    });
    out[poolId] = { ...pool, powers: nextPowers };
  }
  return out;
}
