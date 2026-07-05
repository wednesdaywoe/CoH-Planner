import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bridgeAttrib,
  ingestExportPower,
  identityKey,
  structuralKey,
  parseDuration,
  type AtomicEffect,
} from './core/atomic-effect';

/**
 * DSH4 — validate the closed atomic effect schema + identity key against the
 * COMMITTED parser export (`exported_powers/`, the converter input). This proves the
 * schema fits real data, the identity keys distinguish the collapse-prone sibling
 * sets, and every attrib the HC export uses has a bridge rule (so a renamed/new
 * attrib after an HC patch fails here instead of silently mis-slotting). It does NOT
 * exercise the converter — that is DSH6.
 *
 * See streams/DEDUCTIVE_SCHEMA_HARNESS.md.
 */

const EXPORT_ROOT = fileURLToPath(new URL('../../exported_powers', import.meta.url));

function hcFiles(): string[] {
  const out: string[] = [];
  const skipTop = new Set(['rebirth', 'thunderspy', 'tables']);
  const walk = (dir: string, top: string | null) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (top === null && skipTop.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, top ?? e.name);
      else if (e.name.endsWith('.json') && e.name !== 'index.json') out.push(p);
    }
  };
  walk(EXPORT_ROOT, null);
  return out;
}

function loadByFullName(substr: string): { path: string; power: { full_name?: string; effects?: unknown[] } } {
  for (const f of hcFiles()) {
    const power = JSON.parse(fs.readFileSync(f, 'utf-8'));
    if ((power.full_name || '').toLowerCase().endsWith(substr.toLowerCase())) return { path: f, power };
  }
  throw new Error(`no HC export power ending in ${substr}`);
}

describe('DSH4 atomic-effect schema — export present', () => {
  it('the committed exported_powers/ input exists', () => {
    expect(fs.existsSync(EXPORT_ROOT)).toBe(true);
  });
});

describe('bridgeAttrib — vocabulary rules', () => {
  it('maps damage, mez, scalar, movement, and by-type-with-context', () => {
    expect(bridgeAttrib('Lethal_Dmg')).toEqual({ effectType: 'Damage', subType: 'Lethal' });
    expect(bridgeAttrib('Negative_Energy_Dmg')).toEqual({ effectType: 'Damage', subType: 'Negative' });
    expect(bridgeAttrib('Stunned')).toEqual({ effectType: 'Mez', subType: 'Stunned' });
    expect(bridgeAttrib('RechargeTime')).toEqual({ effectType: 'RechargeTime' });
    expect(bridgeAttrib('RunningSpeed')).toEqual({ effectType: 'Movement', subType: 'Run' });
    // by-type: effectType comes from aspect/table, not the name
    expect(bridgeAttrib('Smashing', 'Current', 'Melee_Defense')).toEqual({ effectType: 'Defense', subType: 'Smashing' });
    expect(bridgeAttrib('Smashing', 'Resistance', 'Res_Smashing')).toEqual({ effectType: 'Resistance', subType: 'Smashing' });
  });

  it('Heal_Dmg with aspect=Resistance is healing-received, not -resistance', () => {
    expect(bridgeAttrib('Heal_Dmg', 'Absolute', 'Ranged_Heal')).toEqual({ effectType: 'Heal' });
    expect(bridgeAttrib('Heal_Dmg', 'Resistance', 'Ranged_Ones')).toEqual({ effectType: 'HealResistance' });
  });

  it('aspect=Strength is a buff, not the applied effect (verified vs Mids oracle)', () => {
    // <type>_Dmg + Str ⇒ DamageBuff (Build Up), not Damage
    expect(bridgeAttrib('Smashing_Dmg', 'Strength', 'Melee_Buff_Dmg')).toEqual({ effectType: 'DamageBuff', subType: 'Smashing' });
    expect(bridgeAttrib('Smashing_Dmg', 'Absolute', 'Melee_Damage')).toEqual({ effectType: 'Damage', subType: 'Smashing' });
    // mez + Str ⇒ Enhancement (Power Boost); mez + Res ⇒ MezResist; else ⇒ Mez
    expect(bridgeAttrib('Held', 'Strength', 'Melee_Stun')).toEqual({ effectType: 'Enhancement', subType: 'Held' });
    expect(bridgeAttrib('Held', 'Resistance', 'Ranged_Ones')).toEqual({ effectType: 'MezResist', subType: 'Held' });
    expect(bridgeAttrib('Held', 'Duration', 'Ranged_Hold')).toEqual({ effectType: 'Mez', subType: 'Held' });
    // bare by-type + Str (not on def/res table) ⇒ Enhancement (Power Boost secondary)
    expect(bridgeAttrib('Smashing', 'Strength', 'Melee_Stun')).toEqual({ effectType: 'Enhancement', subType: 'Smashing' });
  });

  it('defers (does not mis-map) a by-type attrib co-listed on a mez/notify table', () => {
    const r = bridgeAttrib('Smashing', 'Current', 'Melee_Ones');
    expect(r.effectType).toBe('Unmapped');
    expect(r.reason).toContain('co-listed');
  });

  it('parseDuration reads the "N seconds" export string', () => {
    expect(parseDuration('5 seconds')).toBe(5);
    expect(parseDuration('0 seconds')).toBe(0);
    expect(parseDuration(12.5)).toBe(12.5);
    expect(parseDuration('')).toBe(0);
  });
});

describe('ingest — no silent drops, sign preserved', () => {
  it('emits exactly one record per (template × attrib)', () => {
    const { power } = loadByFullName('Arachnos_Soldier.Single_Shot');
    const expected = (power.effects as { templates?: { attribs?: string[] }[] }[])
      .flatMap((g) => g.templates ?? [])
      .reduce((n, t) => n + (t.attribs?.length ?? 0), 0);
    expect(ingestExportPower(power as never).length).toBe(expected);
  });

  it('preserves the sign of a debuff scale (no Math.abs at ingest)', () => {
    // scan a chunk of HC for any negative-scale template and confirm it survives
    let sawNegative = false;
    for (const f of hcFiles().slice(0, 400)) {
      const power = JSON.parse(fs.readFileSync(f, 'utf-8'));
      for (const e of ingestExportPower(power)) {
        if (e.scale < 0) { sawNegative = true; break; }
      }
      if (sawNegative) break;
    }
    expect(sawNegative).toBe(true);
  });
});

describe('identity keys — distinguish the collapse-prone siblings', () => {
  it('Single Shot: the PvE and PvP Lethal damage do not collapse into one key', () => {
    const { power } = loadByFullName('Arachnos_Soldier.Single_Shot');
    const dmg = ingestExportPower(power as never).filter(
      (e) => e.effectType === 'Damage' && e.subType === 'Lethal',
    );
    // Two Lethal damage records — the base and the PvP variant. In our export the
    // PvP variant is a distinct `_pvpdamage` table at pv=Any (not pvMode=PvP), so the
    // distinguishing axis is modifierTable; either way they must NOT share a key.
    expect(dmg.length).toBeGreaterThanOrEqual(2);
    expect(new Set(dmg.map(structuralKey)).size).toBeGreaterThanOrEqual(2);
  });

  it('Flash Arrow: the resistible AND unresistable ToHit twin both survive as distinct keys', () => {
    const { power } = loadByFullName('Trick_Arrow.Flash_Arrow');
    const tohit = ingestExportPower(power as never).filter((e) => e.effectType === 'ToHit');
    expect(tohit.some((e) => e.resistible)).toBe(true);
    expect(tohit.some((e) => !e.resistible)).toBe(true);
    // the twin must NOT collapse: resistible vs unresistable ⇒ different identity keys
    const resKey = tohit.find((e) => e.resistible)!;
    const unresKey = tohit.find((e) => !e.resistible)!;
    expect(identityKey(resKey)).not.toBe(identityKey(unresKey));
    expect(structuralKey(resKey)).not.toBe(structuralKey(unresKey));
  });

  it('identityKey is deterministic and value-sensitive; structuralKey is scale-agnostic', () => {
    const base: AtomicEffect = {
      effectType: 'ToHit', pvMode: 'Any', resistible: true, toWho: 'Target',
      attribType: 'Magnitude', aspect: 'Cur', modifierTable: 'Ranged_Debuff_ToHit',
      scale: -0.1, magnitude: 1, duration: 6, stacking: 'No', baseProbability: 1,
    };
    expect(identityKey(base)).toBe(identityKey({ ...base }));
    // scale is part of the identity key (distinguishes duration/twin variants)
    expect(identityKey(base)).not.toBe(identityKey({ ...base, scale: -0.2 }));
    // but NOT part of the structural key (scale is skew-distrusted for the oracle diff)
    expect(structuralKey(base)).toBe(structuralKey({ ...base, scale: -0.2 }));
  });
});

describe('coverage — every HC attrib has a bridge rule (post-patch regression guard)', () => {
  it('no HC export attrib falls through to "no bridge rule"; reports coverage', () => {
    const distinctAttribs = new Set<string>();
    const effectTypeCounts: Record<string, number> = {};
    let totalRecords = 0;
    let unmapped = 0;
    const files = hcFiles();
    for (const f of files) {
      const power = JSON.parse(fs.readFileSync(f, 'utf-8'));
      for (const g of power.effects ?? []) {
        for (const t of g.templates ?? []) {
          for (const a of t.attribs ?? []) distinctAttribs.add(a);
        }
      }
      for (const e of ingestExportPower(power)) {
        totalRecords++;
        effectTypeCounts[e.effectType] = (effectTypeCounts[e.effectType] ?? 0) + 1;
        if (e.effectType === 'Unmapped') unmapped++;
      }
    }

    // COMPLETENESS: every distinct attrib string is recognized by SOME rule — i.e.
    // never "no bridge rule". (Deferred by-type/parser-unknown reasons are allowed;
    // an unrecognized attrib name is not.) This is the HC-patch tripwire.
    const noRule: string[] = [];
    for (const a of distinctAttribs) {
      const r = bridgeAttrib(a); // no table context — enough to prove the name is known
      if (r.effectType === 'Unmapped' && (r.reason ?? '').startsWith('no bridge rule')) {
        noRule.push(a);
      }
    }
    expect(noRule).toEqual([]);

    const mappedPct = ((totalRecords - unmapped) / totalRecords) * 100;
    // eslint-disable-next-line no-console
    console.log(
      `[DSH4] HC: ${files.length} powers, ${totalRecords} atomic records, ` +
      `${distinctAttribs.size} distinct attribs, ${mappedPct.toFixed(1)}% mapped ` +
      `(${unmapped} Unmapped = by-type-on-mez/notify + parser-unknown, deferred to DSH6). ` +
      `effectTypes: ${Object.entries(effectTypeCounts).sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}:${v}`).join(' ')}`,
    );
    // the confidently-mappable core should dominate
    expect(mappedPct).toBeGreaterThan(80);
  });
});
