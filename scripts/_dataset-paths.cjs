/**
 * Shared CLI/path helper for the conversion scripts in this folder.
 *
 * Each script writes generated TypeScript into `src/data/`. As individual
 * data files migrate into `src/data/datasets/<id>/`, the script that
 * regenerates them needs to route to the dataset folder instead of the
 * legacy path (otherwise it clobbers the runtime facade with raw data).
 *
 * Usage:
 *
 *     const { parseDatasetArg, datasetPath, dataPath } = require('./_dataset-paths.cjs');
 *     const datasetId = parseDatasetArg();          // "homecoming" by default
 *     const atTablesOut = datasetPath(datasetId, 'at-tables.ts');
 *     const legacyOut   = dataPath('io-sets-raw.ts');
 *
 * The `--dataset <id>` flag is recognized in `process.argv`. If absent,
 * defaults to `'homecoming'` so existing muscle memory keeps working.
 *
 * `datasetPath` is for files that have ALREADY moved into the dataset
 * folder (per MULTI_DATASET_PLAN.md). `dataPath` is for files that
 * haven't migrated yet — when they migrate, switch their generator over
 * to `datasetPath`.
 */

const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

const KNOWN_DATASETS = new Set(['homecoming', 'rebirth']);

/**
 * Read `--dataset <id>` (or `--dataset=<id>`) from argv. Returns the id
 * or `'homecoming'` if no flag was provided.
 */
function parseDatasetArg(argv = process.argv) {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dataset' && i + 1 < argv.length) return validate(argv[i + 1]);
    if (a.startsWith('--dataset=')) return validate(a.slice('--dataset='.length));
  }
  return 'homecoming';
}

function validate(id) {
  if (!KNOWN_DATASETS.has(id)) {
    throw new Error(
      `Unknown dataset "${id}". Known: ${[...KNOWN_DATASETS].join(', ')}. ` +
      `Add it to KNOWN_DATASETS in scripts/_dataset-paths.cjs first.`,
    );
  }
  return id;
}

/**
 * Resolve a path under `src/data/datasets/<id>/`. Use this for files that
 * have already migrated into the per-dataset folder.
 */
function datasetPath(datasetId, ...sub) {
  return path.join(REPO_ROOT, 'src', 'data', 'datasets', datasetId, ...sub);
}

/**
 * Resolve a path under `src/data/` directly. Use this for files that
 * haven't migrated yet — when they do, switch to `datasetPath` and the
 * facade at the original path will continue to work.
 */
function dataPath(...sub) {
  return path.join(REPO_ROOT, 'src', 'data', ...sub);
}

module.exports = {
  parseDatasetArg,
  datasetPath,
  dataPath,
  REPO_ROOT,
};
