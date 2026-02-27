/**
 * Revert stats blocks changed by fix-stats.cjs back to committed (I28P2) values.
 *
 * fix-stats.cjs overwrote I28P2 patch values with pre-patch raw data values.
 * This script restores the stats blocks from the committed git HEAD versions,
 * preserving all other audit changes (enhancements, set categories, effects).
 *
 * Usage:
 *   node scripts/revert-stats.cjs --dry-run   # Show what would change
 *   node scripts/revert-stats.cjs --apply      # Apply changes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');

const POWERSETS_PATH = 'src/data/powersets';

// EAT/VEAT directories — their stats were manually fixed (arc, swapped stats, etc.)
// and should NOT be reverted. fix-stats.cjs didn't change these.
const EXCLUDE_DIRS = [
  'arachnos-soldier',
  'arachnos-widow',
  'peacebringer',
  'warshade',
];

// Get list of modified powerset files
const gitStatus = execSync(`git diff --name-only -- "${POWERSETS_PATH}"`, { encoding: 'utf-8' });
const modifiedFiles = gitStatus.trim().split('\n').filter(f => {
  if (!f.endsWith('.ts') || f.endsWith('index.ts')) return false;
  // Exclude EAT/VEAT directories
  const rel = f.replace(POWERSETS_PATH + '/', '');
  return !EXCLUDE_DIRS.some(dir => rel.startsWith(dir + '/'));
});

const statsRegex = /"stats"\s*:\s*\{[^}]*\}/s;

let revertedCount = 0;
let skippedCount = 0;

for (const relPath of modifiedFiles) {
  const absPath = path.resolve(relPath);
  if (!fs.existsSync(absPath)) {
    skippedCount++;
    continue;
  }

  // Get committed version's stats block
  let committedContent;
  try {
    committedContent = execSync(`git show HEAD:"${relPath}"`, { encoding: 'utf-8' });
  } catch {
    skippedCount++;
    continue;
  }

  const committedStats = committedContent.match(statsRegex);
  if (!committedStats) {
    skippedCount++;
    continue;
  }

  // Get current working version
  const currentContent = fs.readFileSync(absPath, 'utf-8');
  const currentStats = currentContent.match(statsRegex);
  if (!currentStats) {
    skippedCount++;
    continue;
  }

  // Compare - skip if stats are already the same
  if (committedStats[0] === currentStats[0]) {
    skippedCount++;
    continue;
  }

  // Restore committed stats block into current content
  const updatedContent = currentContent.replace(statsRegex, committedStats[0]);

  const prefix = applyChanges ? 'REVERTED' : '[DRY-RUN]';
  console.log(`${prefix}: ${relPath}`);

  // Show the diff
  const parseStats = (block) => {
    const pairs = {};
    const re = /"(\w+)"\s*:\s*([0-9.e+-]+)/g;
    let m;
    while ((m = re.exec(block)) !== null) pairs[m[1]] = parseFloat(m[2]);
    return pairs;
  };

  const oldStats = parseStats(currentStats[0]);
  const newStats = parseStats(committedStats[0]);

  for (const key of new Set([...Object.keys(oldStats), ...Object.keys(newStats)])) {
    if (oldStats[key] !== newStats[key]) {
      const from = oldStats[key] !== undefined ? oldStats[key] : '(missing)';
      const to = newStats[key] !== undefined ? newStats[key] : '(removed)';
      console.log(`  ${key}: ${from} → ${to}`);
    }
  }

  if (applyChanges) {
    fs.writeFileSync(absPath, updatedContent);
  }

  revertedCount++;
}

console.log(`\n=== ${revertedCount} files ${applyChanges ? 'reverted' : 'would revert'}, ${skippedCount} skipped ===`);
if (!applyChanges && revertedCount > 0) {
  console.log('Run with --apply to write changes');
}
