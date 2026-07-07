import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Export-staleness guard — the parser→export currency gate.
 *
 * `exported_powers/<dataset>` is produced by the Python bin parser reading the
 * gitignored `.pigg` archives. CI has neither the archives nor Python, so this
 * tree — unlike the generated TS under `src/data/datasets` (regenerated from
 * committed `exported_powers` by the regen-diff workflow) — cannot be
 * regenerate-and-diffed. A parser change that ships without a matching
 * re-export leaves the committed JSON stale and every downstream fix inert (it
 * bit twice: the 2026-07-06 tspy hybrid relabel; the incarnate one-dataset regen).
 *
 * The cross-check: `export_powers.py` stamps each dataset's output dir with an
 * `_export_manifest.json` recording the fingerprint of the powers-exporter
 * SOURCE at export time (every parser .py plus export_powers.py). Here we
 * recompute that fingerprint from the committed sources and assert every
 * dataset's manifest matches. If the parser changed but a dataset was not
 * re-exported, its recorded fingerprint diverges and this test goes red; the
 * only fix is to actually re-export that dataset (which re-stamps).
 *
 * This MUST replicate bin_crawler/_export_fingerprint.py byte for byte: sorted
 * (posix-relpath-from-bin_crawler, file-bytes) folded into sha256 as
 * `relpath\0<bytes>\0` per file. A divergence between the two implementations
 * surfaces as a permanently-red guard, never a silent gap.
 */

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PKG_ROOT = join(REPO_ROOT, 'tools', 'bin-crawler', 'bin_crawler');

// Per-dataset committed export root → its manifest. HC lives at the
// `exported_powers/` root; rebirth/thunderspy are nested (their assets-dir
// basenames), mirroring how each is exported with an explicit --output-dir.
const DATASET_MANIFEST: Record<string, string> = {
  homecoming: join(REPO_ROOT, 'exported_powers', '_export_manifest.json'),
  rebirth: join(REPO_ROOT, 'exported_powers', 'rebirth', '_export_manifest.json'),
  thunderspy: join(REPO_ROOT, 'exported_powers', 'thunderspy', '_export_manifest.json'),
};

function walkPy(dir: string): string[] {
  const out: string[] = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === '__pycache__') continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkPy(full));
    else if (ent.name.endsWith('.py')) out.push(full);
  }
  return out;
}

/** sha256 of the powers-exporter source — mirrors parser_fingerprint() in Python. */
function computeFingerprint(): string {
  const files = [...walkPy(join(PKG_ROOT, 'parser')), join(PKG_ROOT, 'export_powers.py')];
  const entries = files.map((f) => ({
    rel: relative(PKG_ROOT, f).split('\\').join('/'), // POSIX relpath
    bytes: readFileSync(f),
  }));
  entries.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  const h = createHash('sha256');
  for (const e of entries) {
    h.update(e.rel, 'utf-8');
    h.update(Buffer.from([0]));
    h.update(e.bytes);
    h.update(Buffer.from([0]));
  }
  return h.digest('hex');
}

describe('export-staleness guard (parser ↔ exported_powers fingerprint)', () => {
  const expected = computeFingerprint();

  it('computes a stable 64-hex fingerprint from the committed exporter source', () => {
    expect(expected).toMatch(/^[0-9a-f]{64}$/);
  });

  for (const [dataset, manifestPath] of Object.entries(DATASET_MANIFEST)) {
    it(`${dataset}: exported_powers matches the current parser (not stale)`, () => {
      expect(
        existsSync(manifestPath),
        `Missing ${relative(REPO_ROOT, manifestPath)} — export ${dataset} with export_powers.py to stamp it.`,
      ).toBe(true);
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      expect(
        manifest.parser_fingerprint,
        `exported_powers/${dataset === 'homecoming' ? '' : dataset + '/'} is STALE: it was produced by a different ` +
          `bin_crawler exporter than what is committed now. Re-run the powers export for ${dataset} ` +
          `(py -3 -m bin_crawler.export_powers --assets-dir <${dataset} pigg dir> --output-dir ` +
          `exported_powers${dataset === 'homecoming' ? '' : '/' + dataset}) and commit the refreshed tree.`,
      ).toBe(expected);
    });
  }
});
