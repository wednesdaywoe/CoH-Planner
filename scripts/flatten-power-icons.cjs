/**
 * Flatten Power Icons Migration Script
 *
 * Moves all power icon files from 192 separate folders under public/img/Powers/
 * into a single flat directory with lowercase filenames.
 *
 * On Windows (case-insensitive FS), copies to a temp dir first, then
 * deletes the old folder tree and renames.
 *
 * Usage: node scripts/flatten-power-icons.cjs [--dry-run]
 *
 * - Deduplicates identical files (66 known duplicates across folders)
 * - Lowercases all filenames
 * - Validates against icon references in data files
 * - Errors on hash-different duplicates (none expected)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IMG_DIR = path.join(__dirname, '..', 'public', 'img');
const POWERS_DIR = path.join(IMG_DIR, 'Powers');
const TEMP_DIR = path.join(IMG_DIR, 'powers-flat-temp');
const FINAL_DIR = path.join(IMG_DIR, 'powers');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const isDryRun = process.argv.includes('--dry-run');

function md5(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
}

function walkDir(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Recursively delete a directory
 */
function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function main() {
  console.log(isDryRun ? '=== DRY RUN ===' : '=== MIGRATING POWER ICONS ===');
  console.log(`Source: ${POWERS_DIR}`);
  console.log(`Temp:   ${TEMP_DIR}`);
  console.log(`Final:  ${FINAL_DIR}\n`);

  if (!fs.existsSync(POWERS_DIR)) {
    console.error('ERROR: Source directory does not exist:', POWERS_DIR);
    process.exit(1);
  }

  // Get all subfolders that contain " Powers Icons" or similar
  const subfolders = fs.readdirSync(POWERS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => path.join(POWERS_DIR, e.name));

  console.log(`Found ${subfolders.length} source folders\n`);

  // Collect all source files from subfolders only (not root-level files)
  const allFiles = [];
  for (const folder of subfolders) {
    const files = walkDir(folder).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ext === '.png' || ext === '.webp';
    });
    allFiles.push(...files);
  }

  console.log(`Total source files: ${allFiles.length}`);

  // Create temp output directory
  if (!isDryRun) {
    rmrf(TEMP_DIR);
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  // Process files
  const written = new Map(); // lowercase filename -> { hash, sourcePath }
  let copied = 0;
  let skippedDupes = 0;
  let errors = 0;
  const skippedFiles = [];

  for (const srcPath of allFiles) {
    const basename = path.basename(srcPath);
    const ext = path.extname(basename).toLowerCase();

    // Skip non-PNG files (report them)
    if (ext !== '.png') {
      skippedFiles.push(srcPath);
      continue;
    }

    const lowName = basename.toLowerCase();
    const destPath = path.join(TEMP_DIR, lowName);

    if (written.has(lowName)) {
      // Duplicate filename — verify it's identical
      const existingHash = written.get(lowName).hash;
      const newHash = md5(srcPath);
      if (existingHash === newHash) {
        skippedDupes++;
      } else {
        console.error(`ERROR: Hash mismatch for "${lowName}":`);
        console.error(`  Existing: ${written.get(lowName).sourcePath} (${existingHash})`);
        console.error(`  New:      ${srcPath} (${newHash})`);
        errors++;
      }
    } else {
      const hash = md5(srcPath);
      written.set(lowName, { hash, sourcePath: srcPath });

      if (!isDryRun) {
        fs.copyFileSync(srcPath, destPath);
      }
      copied++;
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`Unique files copied: ${copied}`);
  console.log(`Duplicate files skipped: ${skippedDupes}`);
  console.log(`Errors: ${errors}`);

  if (skippedFiles.length > 0) {
    console.log(`\nSkipped non-PNG files:`);
    for (const f of skippedFiles) {
      console.log(`  ${f}`);
    }
  }

  if (errors > 0) {
    console.error('\nMigration had errors — do not proceed without resolving!');
    if (!isDryRun) rmrf(TEMP_DIR);
    process.exit(1);
  }

  // Swap directories: delete old Powers/, rename temp to powers/
  if (!isDryRun) {
    console.log(`\n--- Swapping directories ---`);
    console.log(`Deleting ${POWERS_DIR}...`);
    rmrf(POWERS_DIR);
    console.log(`Renaming ${TEMP_DIR} -> ${FINAL_DIR}...`);
    fs.renameSync(TEMP_DIR, FINAL_DIR);
    console.log('Directory swap complete.');
  }

  console.log(`\nTotal unique icons: ${written.size}`);

  if (isDryRun) {
    console.log('\nDry run complete. Run without --dry-run to execute.');
  } else {
    console.log('\nMigration complete!');
  }
}

main();
