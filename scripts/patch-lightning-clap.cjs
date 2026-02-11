/**
 * patch-lightning-clap.cjs
 * Patches Lightning Clap power files across multiple ATs.
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'data', 'powersets');

const FILES = [
  path.join(BASE, 'scrapper', 'primary', 'electrical-melee', 'lightning-clap.ts'),
  path.join(BASE, 'brute', 'primary', 'electrical-melee', 'lightning-clap.ts'),
  path.join(BASE, 'stalker', 'primary', 'electrical-melee', 'lightning-clap.ts'),
  path.join(BASE, 'tanker', 'secondary', 'electrical-melee', 'lightning-clap.ts'),
];

function addToJsonArray(content, arrayKey, newEntries) {
  // Find the array start
  const startMarker = '"' + arrayKey + '":';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return { content, added: [] };
  const bracketOpen = content.indexOf('[', startIdx);
  if (bracketOpen === -1) return { content, added: [] };
  const bracketClose = content.indexOf(']', bracketOpen);
  if (bracketClose === -1) return { content, added: [] };

  let arrayContent = content.substring(bracketOpen + 1, bracketClose);
  const added = [];
  for (const entry of newEntries) {
    if (!arrayContent.includes('"' + entry + '"')) {
      arrayContent += ',
    "' + entry + '"';
      added.push('"' + entry + '"');
    }
  }
  if (added.length > 0) {
    content = content.substring(0, bracketOpen + 1) + arrayContent + content.substring(bracketClose);
  }
  return { content, added };
}

let totalPatched = 0;

for (const filePath of FILES) {
  const shortName = path.relative(path.join(__dirname, '..'), filePath);
  if (!fs.existsSync(filePath)) {
    console.log('[SKIP] ' + shortName + ' -- file does not exist');
    continue;
  }
  console.log('\n[PATCH] ' + shortName);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = [];

  // 1. targetType
  if (content.includes('"targetType": "Self"')) {
    content = content.replace('"targetType": "Self"', '"targetType": "Foe"');
    changes.push('targetType: Self -> Foe');
  }

  // 2. accuracy 0.8 -> 1
  const accRe = /"accuracy":\s*0\.8\b/;
  if (accRe.test(content)) {
    content = content.replace(accRe, '"accuracy": 1');
    changes.push('accuracy: 0.8 -> 1');
  }

  // 3. recharge 30 -> 15
  const rechRe = /"recharge":\s*30\b/;
  if (rechRe.test(content)) {
    content = content.replace(rechRe, '"recharge": 15');
    changes.push('recharge: 30 -> 15');
  }

  // 4. damage block after maxSlots
  const maxSlotsRe = /"maxSlots":\s*6/;
  const dmgRe = /"damage":\s*\{/;
  if (maxSlotsRe.test(content) && !dmgRe.test(content)) {
    content = content.replace(
      /("maxSlots":\s*6)(,?)\s*\n/,
      '$1,\n  "damage": {\n    "type": "Energy",\n    "scale": 2.76,\n    "table": "Melee_Damage"\n  },\n'
    );
    changes.push('Added damage block');
  }

  // 5. allowedEnhancements
  {
    const result = addToJsonArray(content, 'allowedEnhancements', ['Damage']);
    if (result.added.length > 0) {
      content = result.content;
      changes.push('Added ' + result.added.join(', ') + ' to allowedEnhancements');
    }
  }

  // 6. allowedSetCategories
  {
    const result = addToJsonArray(content, 'allowedSetCategories', [
      'Melee AoE Damage',
      'Universal Damage Sets',
    ]);
    if (result.added.length > 0) {
      content = result.content;
      changes.push('Added ' + result.added.join(' and ') + ' to allowedSetCategories');
    }
  }

  // 7. shortHelp
  {
    const oldH = '"shortHelp": "PBAoE, Foe Disorient, Knockback"';
    const newH = '"shortHelp": "PBAoE, DMG(Energy), Foe Disorient, Knockback"';
    if (content.includes(oldH)) {
      content = content.replace(oldH, newH);
      changes.push('shortHelp: added DMG(Energy)');
    }
  }

  // 8. JSDoc
  {
    const oldC = ' * PBAoE, Foe Disorient, Knockback';
    const newC = ' * PBAoE, DMG(Energy), Foe Disorient, Knockback';
    if (content.includes(oldC)) {
      content = content.replace(oldC, newC);
      changes.push('JSDoc: added DMG(Energy)');
    }
  }

  if (changes.length === 0) {
    console.log('  No changes needed.');
  } else {
    fs.writeFileSync(filePath, content, 'utf-8');
    for (const c of changes) {
      console.log('  - ' + c);
    }
    console.log('  => ' + changes.length + ' change(s) written.');
    totalPatched++;
  }
}

console.log('\nDone. Patched ' + totalPatched + ' file(s).\n');