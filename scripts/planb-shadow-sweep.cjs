/**
 * Plan B — the shared corpus sweep every `planb-shadow-*` gate walks.
 *
 * This exists because the sweep was copy-pasted into seven shadows, and every copy had
 * the same hole: it walked `generated/powersets` only. Pool and epic-pool powers —
 * Health, Stamina, Tough, Weave, Maneuvers, Assault, and the entire epic/patron tier,
 * ~1,358 powers across the three datasets — live in `power-pools.ts` / `epic-pools.ts`,
 * built by two separate converters. So every gate's "corpus-wide, 0 divergences" claim
 * was structurally silent about ~15% of the corpus (found 2026-07-15).
 *
 * Two independent bugs stacked, which is why nothing caught it: those powers had no
 * atoms at all (the pool converters never called `encodeAtomsForEmit`), so each helper
 * returned `undefined` and the appliers fell back to the bag — behavior-preserving, and
 * therefore invisible. Mutation-testing a gate cannot find this: every mutant still
 * passes on a corpus that excludes the affected powers.
 *
 * Hence ONE sweep, shared. A gate cannot forget to look somewhere the sweep already
 * goes, and a future generated tree is covered by construction rather than by each
 * author remembering. Sweeping `generated/` wholesale (not a named subdirectory) is the
 * point — do not narrow it back.
 */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');

/**
 * Every Power-shaped object reachable from a generated module's exports.
 *
 * `generated/powersets/**` exports one power per file at the top level, but the pool
 * trees nest theirs inside pool objects (`{ pools: { fitness: { powers: [...] } } }`),
 * so this recurses. `seen` guards the cycles those structures contain.
 *
 * `effects` must be the BAG — a plain object. The recursion also reaches
 * `resolvedPseudoPets` ability rows (Lightning_Rod, Shield_Charge_AoE, Geode_Scaling),
 * which carry a `name` and an `effects` ARRAY of effect rows; they are not Powers, have
 * no atom list, and matching them made the gate report nonsense slot names ("projected
 * slots [0, 1, 2]" — array indices). Requiring a non-array `effects`, or an `atoms`
 * array, keeps this to real powers.
 */
function isPower(node) {
  if (typeof node.name !== 'string') return false;
  const hasBag = node.effects && typeof node.effects === 'object' && !Array.isArray(node.effects);
  const hasAtoms = Array.isArray(node.atoms);
  return Boolean(hasBag || hasAtoms);
}

function collectPowers(node, out = [], seen = new Set()) {
  if (!node || typeof node !== 'object' || seen.has(node)) return out;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const v of node) collectPowers(v, out, seen);
    return out;
  }
  if (isPower(node)) out.push(node);
  for (const v of Object.values(node)) collectPowers(v, out, seen);
  return out;
}

/**
 * Walk one dataset's whole generated tree, calling `onPower(power, relPath)` for each
 * player power found.
 *
 * `opts.onLoadError(relPath, err)` is called for a module that fails to require. A gate
 * that treats a load failure as a skip is claiming a pass for a power it never checked,
 * so callers should surface it as a divergence; the default rethrows rather than let a
 * caller silently inherit the lenient behavior.
 */
function sweepDataset(dataset, onPower, opts = {}) {
  const root = path.join(REPO, 'src/data/datasets', dataset, 'generated');
  if (!fs.existsSync(root)) {
    if (opts.onMissingDataset) opts.onMissingDataset(dataset);
    return;
  }
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { stack.push(p); continue; }
      if (!e.name.endsWith('.ts') || e.name === 'index.ts') continue;
      const rel = path.relative(REPO, p);
      let mod;
      try {
        mod = require(p);
      } catch (err) {
        if (opts.onLoadError) { opts.onLoadError(rel, err); continue; }
        throw err;
      }
      for (const power of collectPowers(mod)) onPower(power, rel);
    }
  }
}

module.exports = { REPO, collectPowers, sweepDataset };
