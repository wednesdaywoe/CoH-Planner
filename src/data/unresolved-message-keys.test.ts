import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { isUnresolvedMessageKey } from '../../scripts/_display-text.cjs';

/**
 * No unresolved message-store key may reach the UI as if it were text.
 *
 * Most strings in the bins are literal, but some are stored as a key — `P`
 * followed by a 32-bit hash — that the game client resolves at display time
 * against `bin/clientmessages-en.bin`. The parser has no message-store resolver,
 * so those fields arrive in the export holding the key itself, and downstream
 * nothing distinguishes them from real text. Mercenaries > Soldiers rendered a
 * tag reading literally "P2937209522".
 *
 * The converters drop such fields (`scripts/_display-text.cjs`). This test is
 * what makes that a rule rather than four patched call sites: it reads the same
 * predicate the converters apply and sweeps the whole generated corpus, so a
 * text field nobody thought to guard fails here instead of on screen.
 *
 * This gates the SYMPTOM. The real fix is a message-store resolver in the
 * parser — which lives in the canonical repo and is not vendored here.
 */

const GENERATED_ROOT = path.join(__dirname, 'datasets');

function generatedFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.ts')) out.push(full);
    }
  };
  walk(GENERATED_ROOT);
  return out;
}

describe('unresolved message-store keys', () => {
  it('recognises a key and leaves real text alone', () => {
    // Mutation-proofing the predicate itself: a gate built on a regex that
    // matched nothing would sweep the whole corpus and pass.
    expect(isUnresolvedMessageKey('P2937209522')).toBe(true);
    expect(isUnresolvedMessageKey('P1678690538')).toBe(true);
    expect(isUnresolvedMessageKey('  P2937209522  ')).toBe(true);
    expect(isUnresolvedMessageKey('Ranged, Moderate DMG(Fire), Foe -Def')).toBe(false);
    expect(isUnresolvedMessageKey('Summon Soldiers')).toBe(false);
    expect(isUnresolvedMessageKey('P50')).toBe(false); // too short to be a hash
    expect(isUnresolvedMessageKey('')).toBe(false);
  });

  it('appears in no generated dataset file', () => {
    const files = generatedFiles();
    // A zero-file sweep is a silently-passing gate; the corpus is thousands.
    expect(files.length, 'generated dataset files swept').toBeGreaterThan(1000);

    const offenders: string[] = [];
    // Quoted JSON string values only — matching bare identifiers would flag
    // legitimate code (a `P1234` symbol), and every leak so far has been a
    // string field emitted from the export.
    const quoted = /"(P\d{6,})"/g;
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf-8');
      for (const match of text.matchAll(quoted)) {
        if (isUnresolvedMessageKey(match[1])) {
          offenders.push(`${path.relative(GENERATED_ROOT, file)}: ${match[1]}`);
        }
      }
    }
    expect(offenders.slice(0, 20)).toEqual([]);
  });
});
