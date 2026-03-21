/**
 * One-off script to add internalName to VEAT/Kheldian power files
 * that were generated without it.
 *
 * Usage: node scripts/add-internal-name.cjs
 */

const fs = require('fs');
const path = require('path');

const DIRS = [
  'src/data/powersets/peacebringer',
  'src/data/powersets/warshade',
  'src/data/powersets/arachnos-soldier',
  'src/data/powersets/arachnos-widow',
];

function findPowerFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPowerFiles(fullPath));
    } else if (entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      results.push(fullPath);
    }
  }
  return results;
}

let updated = 0;
let skipped = 0;

for (const dir of DIRS) {
  const files = findPowerFiles(dir);
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already has internalName
    if (content.includes('"internalName"')) {
      skipped++;
      continue;
    }

    // Extract the name value: "name": "Some Power Name"
    const nameMatch = content.match(/"name":\s*"([^"]+)"/);
    if (!nameMatch) {
      console.log(`WARNING: No name found in ${file}`);
      continue;
    }

    const displayName = nameMatch[1];
    const internalName = displayName.replace(/\s+/g, '_');

    // Insert internalName after the "name" line
    content = content.replace(
      /("name":\s*"[^"]+")(,?\r?\n)/,
      `$1,\n  "internalName": "${internalName}"$2`
    );

    fs.writeFileSync(file, content, 'utf8');
    updated++;
  }
}

console.log(`Done. Updated: ${updated}, Skipped (already had internalName): ${skipped}`);
