/**
 * A minimal evaluator for the CoH RPN condition language, scoped to exactly the vocabulary
 * that appears in `quickSnipe.condition` / `formVariants[].condition` across all three forks
 * today (`condition` is the only place either string exists on `Power` — see
 * docs/gaps/engine-beta-parity.md). NOT a general port of canonical's `coh_math::expr`
 * (~1200 lines, 47 readers, probabilistic Die/Range values) — this only needs the
 * source-relative subset those two fields actually use.
 *
 * The grammar is whitespace-delimited postfix (reverse Polish): each token either pushes a
 * value or pops its operands and pushes a result, and the result is whatever sits on top of
 * the stack once every token has run (`cur.kToHit source> .97 >=` pushes `cur.kToHit`, reads
 * it via `source>`, pushes `.97`, then `>=` pops both and pushes the comparison).
 *
 * A token this can't resolve — a target-relative reader (`target.isFriend?`, `enttype
 * target>`, `distance`), a cosmetic `@`-constant (`@CustomFX`), or anything else outside the
 * recognized set — throws immediately and aborts evaluation. `evaluateCondition` catches
 * that and returns `false`. This mirrors canonical's own documented semantics exactly:
 * `coh_math::expr`'s `Value::truthy()` on a value it can't resolve returns
 * `EvalError::Indeterminate` rather than `false`, and the ONE caller both fixes here read from
 * (`effective::fast_form_selected` / `with_form_variant`) treats anything short of a definite
 * `Ok(true)` as "the redirect doesn't fire, the base record stands" — so collapsing
 * "definitely false" and "can't tell" into one `false` return is the same conservative
 * outcome the engine reaches, not an invented simplification.
 */

export interface ConditionContext {
  /** Every mode live right now, lower-cased — the build's own `activeModes` (Kheldian forms,
   *  Momentum, Bio Armor adaptations, …) PLUS the synthetic `kengaged` / `koutofcombat` the
   *  engine itself binds from the combat-mode toggle (`gather::live_modes`,
   *  `ENGAGED_MODES`/`OUT_OF_COMBAT_MODES`). Read by `Source.Mode?`. */
  liveModes: ReadonlySet<string>;
  /** Does the build have a power matching this dotted export path (`Pool.Teleportation.
   *  Team_Teleport`) selected in primary/secondary/pools/epic/inherents? Read by
   *  `source.ownPower?`. A temp/granted/redirect-only power (`Temporary_Powers.*`,
   *  `Redirects.*`) is never in a build's own picks, so it correctly reads unowned with no
   *  special-casing needed. */
  ownsPower: (path: string) => boolean;
  /** The same lookup as a count — 0 when not owned. Read by `source.ownPowerNum?`. Real
   *  in-combat stack counters (Blood Frenzy, Tidal Power) are rotation state a static build
   *  can't answer either, and for the same reason never appear in the build's own power
   *  lists, so this also naturally reads 0 for them. */
  ownedPowerCount: (path: string) => number;
  /** The caster's current (buffed, UNCLAMPED) ToHit fraction — archetype `toHitBase` + the
   *  build's global ToHit bonus/100, exactly `crates/coh_math/src/projection.rs`'s
   *  `gate_context` (`caps.to_hit_base + g.to_hit / 100.0`). Read by `cur.kToHit source>`. */
  currentToHit: number;
}

class Unresolved extends Error {}

const NUMBER_TOKEN = /^-?\.?\d/;

function truthy(v: number | string): boolean {
  if (typeof v !== 'number') throw new Unresolved(`symbol ${v} used as a boolean`);
  return v !== 0;
}

function asNumber(v: number | string): number {
  if (typeof v !== 'number') throw new Unresolved(`symbol ${v} used as a number`);
  return v;
}

function asSymbol(v: number | string): string {
  if (typeof v !== 'string') throw new Unresolved(`number ${v} used as a symbol`);
  return v;
}

function pop(stack: (number | string)[]): number | string {
  const v = stack.pop();
  if (v === undefined) throw new Unresolved('stack underflow');
  return v;
}

function boolNum(b: boolean): number {
  return b ? 1 : 0;
}

/** Evaluate one whitespace-delimited postfix condition string against `ctx`. Returns `false`
 *  for a definite no AND for anything this evaluator can't resolve — see the module doc for
 *  why that collapse is the correct, conservative behavior here. */
export function evaluateCondition(condition: string, ctx: ConditionContext): boolean {
  const tokens = condition.trim().split(/\s+/).filter(Boolean);
  const stack: (number | string)[] = [];
  try {
    for (const token of tokens) {
      const lower = token.toLowerCase();
      if (NUMBER_TOKEN.test(token) && !Number.isNaN(Number(token))) {
        stack.push(Number(token));
        continue;
      }
      switch (lower) {
        case '&&':
        case '||': {
          const b = truthy(pop(stack));
          const a = truthy(pop(stack));
          stack.push(boolNum(lower === '&&' ? a && b : a || b));
          break;
        }
        case '!':
          stack.push(boolNum(!truthy(pop(stack))));
          break;
        // `==` is numeric-only (canonical's `Op::NumberEqual`) — a symbol operand aborts
        // rather than coercing. `eq` (below) is the separate symbol-or-number comparator.
        case '==': {
          const b = asNumber(pop(stack));
          const a = asNumber(pop(stack));
          stack.push(boolNum(a === b));
          break;
        }
        // Symbol-or-number equality, case-insensitive for symbols — the export carries
        // casing variants of the same identity (`Class_Scrapper` / `class_scrapper`).
        case 'eq': {
          const b = pop(stack);
          const a = pop(stack);
          const result =
            typeof a === 'number' && typeof b === 'number'
              ? a === b
              : typeof a === 'string' && typeof b === 'string'
                ? a.toLowerCase() === b.toLowerCase()
                : false;
          stack.push(boolNum(result));
          break;
        }
        case '>=': {
          const b = asNumber(pop(stack));
          const a = asNumber(pop(stack));
          stack.push(boolNum(a >= b));
          break;
        }
        case '>': {
          const b = asNumber(pop(stack));
          const a = asNumber(pop(stack));
          stack.push(boolNum(a > b));
          break;
        }
        case '<': {
          const b = asNumber(pop(stack));
          const a = asNumber(pop(stack));
          stack.push(boolNum(a < b));
          break;
        }
        case 'source.mode?': {
          const modeId = asSymbol(pop(stack));
          stack.push(boolNum(ctx.liveModes.has(modeId.toLowerCase())));
          break;
        }
        case 'source.ownpower?': {
          const path = asSymbol(pop(stack));
          stack.push(boolNum(ctx.ownsPower(path)));
          break;
        }
        case 'source.ownpowernum?': {
          const path = asSymbol(pop(stack));
          stack.push(ctx.ownedPowerCount(path));
          break;
        }
        case 'source>': {
          const attribute = asSymbol(pop(stack));
          if (attribute.toLowerCase() !== 'cur.ktohit') {
            throw new Unresolved(`unsupported source> attribute ${attribute}`);
          }
          stack.push(ctx.currentToHit);
          break;
        }
        default:
          // Any other reader/constant this evaluator doesn't recognize (`target.isFriend?`,
          // `enttype`, `target>`, `distance`, `@CustomFX`, …) is out of scope — abort rather
          // than silently guessing. A plain bareword with no special punctuation (a power
          // path, a mode id) falls through as a symbol operand instead.
          if (token.startsWith('@') || lower.includes('target')) {
            throw new Unresolved(`unsupported token ${token}`);
          }
          stack.push(token);
      }
    }
    return stack.length > 0 && truthy(stack[stack.length - 1]);
  } catch (err) {
    if (err instanceof Unresolved) return false;
    throw err;
  }
}
