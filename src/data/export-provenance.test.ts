import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Export-provenance guard — the which-tree-did-this-come-from gate.
 *
 * Homecoming ships data through several asset rings (live, open beta, closed
 * beta). Only `live` may ever reach users: a beta export is unreleased,
 * still-moving numbers that will not match anyone's in-game build. Nothing
 * about beta data LOOKS wrong, though — it is internally self-consistent, so it
 * passes the staleness fingerprint, converter validation and the contract
 * totals alike. Reviewing a refresh diff cannot catch it either; the diff is
 * thousands of plausible number changes (DATA-GAP-REGISTER PROV-1/PROV-2).
 *
 * What does distinguish it: every exporter stamps its output with a
 * `source` block naming the shard it read. This asserts that every committed
 * manifest names its dataset's `exportable_ring` — so a beta export cannot be
 * merged without turning CI red, no matter how ordinary its numbers look.
 *
 * `scripts/refresh-from-channel.cjs` already refuses to APPLY a non-exportable
 * ring, and `resolve_export_source` refuses to stamp one. This is the backstop
 * for the paths those two do not cover: a hand-run exporter, an older export
 * predating the gate, or a tree copied in by hand.
 *
 * Matching is on the ring's SUBPATH, not on absolute paths, because the
 * committed manifest may have been stamped on a different workstation than the
 * one running this test. Roots vary per machine; ring subpaths do not. See
 * bin_crawler/assets_sources.json.
 */

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EXPORT_ROOT = join(REPO_ROOT, 'exported_powers');
const REGISTRY_PATH = join(
  REPO_ROOT, 'tools', 'bin-crawler', 'bin_crawler', 'assets_sources.json',
);

type Ring = { subpath: string; note?: string };
type Root = { host: string; path: string };
type DatasetEntry = {
  exportable_ring: string;
  roots: Root[];
  rings: Record<string, Ring>;
};

const registry: { datasets: Record<string, DatasetEntry> } = JSON.parse(
  readFileSync(REGISTRY_PATH, 'utf-8'),
);

/** Committed export dir per dataset — mirrors EXPORT_ROOTS in convert-pet-entities.cjs. */
const DATASET_DIRS: Array<[string, string]> = [
  ['rebirth', join(EXPORT_ROOT, 'rebirth')],
  ['thunderspy', join(EXPORT_ROOT, 'thunderspy')],
  // homecoming is the fallback: it lives flat at the export root.
];

const posix = (p: string) => p.split('\\').join('/');

/** Which dataset a manifest belongs to — the nested forks win over HC's flat root. */
function datasetFor(manifestPath: string): string {
  for (const [dataset, dir] of DATASET_DIRS) {
    if (posix(manifestPath).startsWith(posix(dir) + '/')) return dataset;
  }
  return 'homecoming';
}

/**
 * Every manifest under exported_powers/, found by walking rather than by a
 * hardcoded list: a new sub-export (a fifth exporter, a new fork) is covered
 * the moment it lands, instead of silently sitting outside the guard.
 */
function findManifests(dir: string): string[] {
  const out: string[] = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...findManifests(full));
    else if (ent.name.endsWith('_export_manifest.json')) out.push(full);
  }
  return out;
}

/**
 * Does `assetsDir` sit at <some registered root>/<subpath>?
 *
 * Compared by suffix against the home-relative tail of each root, so a manifest
 * stamped as /home/jiiwii/.wine/…/assets/live and one stamped as
 * /Users/brian/Library/…/assets/live both satisfy their own machine's root
 * without this test knowing whose home directory either is.
 */
function matchesRegisteredRoot(assetsDir: string, entry: DatasetEntry, subpath: string): boolean {
  const actual = posix(assetsDir).replace(/\/+$/, '');
  return entry.roots.some((root) => {
    const rootPath = posix(root.path);
    const tail = rootPath.startsWith('~/') ? rootPath.slice(2) : rootPath;
    const expected = `${tail}/${subpath}`;
    return rootPath.startsWith('~/')
      ? actual.endsWith(`/${expected}`) || actual === expected
      : actual === expected;
  });
}

describe('export-provenance guard (committed exports ↔ exportable ring)', () => {
  const manifests = findManifests(EXPORT_ROOT);

  it('finds the committed manifests to check', () => {
    expect(
      manifests.length,
      `No *_export_manifest.json under exported_powers/ — either the exports are ` +
        `missing or the exporters stopped stamping them, and this guard is inert.`,
    ).toBeGreaterThan(0);
  });

  it('every dataset in the registry has at least one committed manifest', () => {
    const covered = new Set(manifests.map(datasetFor));
    for (const dataset of Object.keys(registry.datasets)) {
      expect(
        covered.has(dataset),
        `${dataset} is registered but has no committed manifest — its export is ` +
          `unguarded. Export it, or drop it from assets_sources.json.`,
      ).toBe(true);
    }
  });

  for (const manifestPath of manifests) {
    const rel = posix(relative(REPO_ROOT, manifestPath));
    const dataset = datasetFor(manifestPath);

    it(`${rel} was read from ${dataset}'s exportable ring`, () => {
      const entry = registry.datasets[dataset];
      expect(entry, `${dataset} is not in assets_sources.json`).toBeDefined();

      const expectedRing = entry.exportable_ring;
      const expectedSubpath = entry.rings[expectedRing]?.subpath;
      expect(
        expectedSubpath,
        `${dataset}'s exportable_ring '${expectedRing}' names no subpath in the registry.`,
      ).toBeDefined();

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      const source = manifest.source;
      expect(
        source,
        `${rel} has no 'source' block, so where its bytes came from is unknowable. ` +
          `Re-export ${dataset} with a current exporter, which stamps one.`,
      ).toBeDefined();

      // Name the offending ring when we can, so the failure explains itself.
      const ringBySubpath = new Map(
        Object.entries(entry.rings).map(([name, r]) => [r.subpath, name]),
      );
      const actualRing = ringBySubpath.get(source.shard);
      const culprit = actualRing
        ? `the '${actualRing}' ring (${entry.rings[actualRing].note ?? ''})`
        : `an unregistered shard`;

      expect(
        source.shard,
        `${rel} was exported from ${culprit}, not ${dataset}'s exportable ring ` +
          `'${expectedRing}' (subpath '${expectedSubpath}').\n` +
          `  Committed data must come from the ring users are on. Beta numbers are ` +
          `unreleased and still moving, and nothing downstream can tell them apart — ` +
          `they are internally consistent and pass every other gate.\n` +
          `  Fix: re-export ${dataset} from its exportable ring ` +
          `(node scripts/refresh-from-channel.cjs${dataset === 'homecoming' ? '' : ` --dataset ${dataset}`}) ` +
          `and commit that instead.`,
      ).toBe(expectedSubpath);

      expect(
        matchesRegisteredRoot(source.assets_dir ?? '', entry, expectedSubpath),
        `${rel} records assets_dir '${source.assets_dir}', which is not ` +
          `<a registered root>/${expectedSubpath} for ${dataset}.\n` +
          `  Registered roots: ${entry.roots.map((r) => `${r.host} (${r.path})`).join(', ')}\n` +
          `  Either it was exported from an unregistered tree — the exact thing the ` +
          `registry exists to prevent — or this machine's root is missing from ` +
          `assets_sources.json.`,
      ).toBe(true);
    });
  }
});
