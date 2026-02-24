// Check raw templates for Fast Healing and Integration
const fs = require('fs');
const path = require('path');

function showTemplates(filePath) {
  const d = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`\n=== ${path.basename(filePath)} ===`);
  d.effects.filter(e => e.is_pvp !== 'PVP_ONLY').forEach(e => {
    e.templates.forEach(t => {
      console.log(`  attribs=${JSON.stringify(t.attribs)} aspect=${t.aspect} scale=${t.scale} table=${t.table}`);
    });
    (e.child_effects || []).forEach(ce => {
      console.log('  --- CHILD EFFECT ---');
      ce.templates.forEach(t => {
        console.log(`    attribs=${JSON.stringify(t.attribs)} aspect=${t.aspect} scale=${t.scale} table=${t.table}`);
      });
    });
  });
}

const base = 'C:/Projects/Raw Data Homecoming/powers/scrapper_defense/regeneration';
showTemplates(path.join(base, 'fast_healing.json'));
showTemplates(path.join(base, 'integration.json'));
showTemplates(path.join(base, 'revive.json')); // Ailment Resistance
