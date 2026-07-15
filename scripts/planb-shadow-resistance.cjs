/**
 * Plan B, Phase 2 Slice 3 — resistance reconstruction shadow (buff + self-penalty).
 *
 * Proves that the atom list reproduces the bag's per-damage-type +resistance BUFF
 * (`effects.resistance`) AND the self-directed −resistance PENALTY (the
 * `toWho:'Self'` entries of `effects.resistanceDebuff`) WITHOUT reading the bag —
 * the precondition for migrating those two appliers in character-totals.ts.
 *
 *   BAG   — `effects.resistance[type]` / `effects.resistanceDebuff[type]`, what the
 *           calc reads today. The buff's `{ scale, perTarget }` comes from
 *           `computeAoePerTargetPatches` (Bio Armor's Evolving Armor grows per foe).
 *   ATOMS — `resistanceBuffValue` / `resistanceSelfDebuffValue`: per-type, rebuilt
 *           from the base Resistance atoms (aspect Res), with perTarget from the
 *           converter-stamped increment atoms.
 *
 * Scope: the EIGHT standard damage-type resistance globals (Smashing…Psionic), the
 * only resistance types the calc totals. The atom bridge and the bag disagree on
 * how they LABEL every other subType (`All` from `base_defense`@Res → the bag routes
 * it to `debuffResistance`; exotic Radiation/Sonic/etc. the bag drops; `Heal` →
 * `HealResistance`) — but none of those reaches a `res<Type>` total, so both sides
 * add zero and comparing them would only measure a naming difference. See
 * `RESIST_STD_SUBTYPES` in atom-query.ts.
 *
 * Exit code is nonzero on any divergence — this GATES, like planb-shadow-pertarget.
 *
 * Usage:
 *   node scripts/planb-shadow-resistance.cjs
 *   node scripts/planb-shadow-resistance.cjs --dataset homecoming
 *   node scripts/planb-shadow-resistance.cjs --power "Evolving Armor"
 */

require('tsx/cjs');
const fs = require('fs');
const path = require('path');
const { resistanceBuffValue, resistanceSelfDebuffValue } = require('../src/data/core/atom-query.ts');

const REPO = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const POWER_FILTER = argVal('--power');
const DATASETS = (() => {
  const picked = argv.flatMap((a, i) => (a === '--dataset' && argv[i + 1] ? [argv[i + 1]] : []));
  return picked.length ? picked : ['homecoming', 'rebirth', 'thunderspy'];
})();

const STD_TYPES = ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'toxic', 'psionic'];
const r4 = (n) => Math.round((n || 0) * 1e4) / 1e4;

/** Normalize a bag buff slot value to `{ scale, perTarget }`. */
function bagBuff(v) {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return { scale: r4(Math.abs(v)), perTarget: 0 };
  return { scale: r4(Math.abs(v.scale)), perTarget: r4(v.perTarget) };
}
function atomBuff(v) {
  return v ? { scale: r4(Math.abs(v.scale)), perTarget: r4(v.perTarget) } : undefined;
}
const eqBuff = (a, b) => (!a && !b) || (a && b && a.scale === b.scale && a.perTarget === b.perTarget);

/** Bag self-penalty scale for a type (only the `toWho:'Self'` entry counts). */
function bagSelf(v) {
  if (!v || typeof v !== 'object' || v.toWho !== 'Self') return undefined;
  return r4(Math.abs(v.scale));
}
function atomSelf(v) {
  return v ? r4(Math.abs(v.scale)) : undefined;
}

const stats = { powers: 0, buffTypes: 0, buffAgree: 0, perTargetTypes: 0, selfTypes: 0, selfAgree: 0 };
const findings = [];

function checkPower(dataset, power, genPath) {
  const name = power.name || genPath;
  if (POWER_FILTER && !name.toLowerCase().includes(POWER_FILTER.toLowerCase())) return;
  stats.powers++;

  const bagRes = power.effects && typeof power.effects.resistance === 'object' ? power.effects.resistance : {};
  const bagDeb = power.effects && typeof power.effects.resistanceDebuff === 'object' ? power.effects.resistanceDebuff : {};
  const atomRes = resistanceBuffValue(power) || {};
  const atomDeb = resistanceSelfDebuffValue(power) || {};

  for (const t of STD_TYPES) {
    // --- BUFF ---
    const bag = bagBuff(bagRes[t]);
    const atom = atomBuff(atomRes[t]);
    if (bag || atom) {
      stats.buffTypes++;
      if ((bag && bag.perTarget) || (atom && atom.perTarget)) stats.perTargetTypes++;
      if (eqBuff(bag, atom)) stats.buffAgree++;
      else {
        findings.push({ kind: 'buff', dataset, name, type: t, bag, atom });
        if (POWER_FILTER) console.log(`  [DIVERGE buff] ${name} ${t}  bag=${JSON.stringify(bag)} atom=${JSON.stringify(atom)}`);
      }
    }
    // --- SELF PENALTY ---
    const bagS = bagSelf(bagDeb[t]);
    const atomS = atomSelf(atomDeb[t]);
    if (bagS !== undefined || atomS !== undefined) {
      stats.selfTypes++;
      if (bagS === atomS) stats.selfAgree++;
      else {
        findings.push({ kind: 'self', dataset, name, type: t, bag: bagS, atom: atomS });
        if (POWER_FILTER) console.log(`  [DIVERGE self] ${name} ${t}  bag=${bagS} atom=${atomS}`);
      }
    }
  }
}

function sweep(dataset) {
  const root = path.join(REPO, 'src/data/datasets', dataset, 'generated/powersets');
  if (!fs.existsSync(root)) return;
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { stack.push(p); continue; }
      if (!e.name.endsWith('.ts') || e.name === 'index.ts') continue;
      let mod;
      try { mod = require(p); } catch { continue; }
      for (const v of Object.values(mod)) {
        if (v && typeof v === 'object' && !Array.isArray(v) && (v.effects || v.atoms)) {
          checkPower(dataset, v, path.relative(REPO, p));
        }
      }
    }
  }
}

for (const ds of DATASETS) sweep(ds);

console.log(`\nPlan B Slice 3 — resistance reconstruction (buff + self-penalty)`);
console.log(`  powers swept:        ${stats.powers}`);
console.log(`  buff type-slots:     ${stats.buffTypes}  (of which per-target: ${stats.perTargetTypes})`);
console.log(`  buff agree:          ${stats.buffAgree}`);
console.log(`  self type-slots:     ${stats.selfTypes}`);
console.log(`  self agree:          ${stats.selfAgree}`);
console.log(`  diverge:             ${findings.length}`);

for (const f of findings.slice(0, 50)) {
  console.log(`\n  [DIVERGE ${f.kind}] ${f.name} (${f.dataset}) ${f.type}`);
  console.log(`      bag  : ${JSON.stringify(f.bag)}`);
  console.log(`      atom : ${JSON.stringify(f.atom)}`);
}
if (findings.length > 50) console.log(`\n  ... and ${findings.length - 50} more`);

if (findings.length) {
  console.log('\nFAIL — atom-derived resistance diverges from the bag. Fix before migrating the applier.');
  process.exit(1);
}
console.log('\nOK — atom-derived resistance buff + self-penalty reproduce the bag corpus-wide (8 standard types).');
