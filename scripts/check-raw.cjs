const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
files.forEach(f => {
  const d = JSON.parse(fs.readFileSync(f, 'utf-8'));
  console.log(`\n=== ${path.basename(path.dirname(f))}/${path.basename(f)} ===`);
  d.effects.filter(e => e.is_pvp !== 'PVP_ONLY').forEach(e => {
    e.templates.forEach(t => {
      console.log(`  attribs=${JSON.stringify(t.attribs)} aspect=${t.aspect} scale=${t.scale} table=${t.table}`);
    });
    (e.child_effects || []).forEach(ce => {
      ce.templates.forEach(t => {
        console.log(`  CHILD: attribs=${JSON.stringify(t.attribs)} aspect=${t.aspect} scale=${t.scale} table=${t.table}`);
      });
    });
  });
});
