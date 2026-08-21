import fs from 'node:fs';
import path from 'node:path';

/**
 * Declared property names of one exported interface, read out of its source text.
 *
 * The emitted-field guards need the type as DATA — what a `Power` or an `ArchetypeStats`
 * declares — so they can hold it against the keys the converters actually write. tsc can't
 * answer that here: the rebuild's own run dies early on missing React deps and never reaches a
 * generated file, and a spread (`...ARCHETYPE_BINARY_STATS[at]`) is exempt from
 * excess-property checking even where it does run.
 *
 * Callers must anchor the result on a field they know is declared. A regex that stopped
 * matching would declare nothing and pass everything.
 */
export function declaredFields(file: string, iface: string): Set<string> {
  const src = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const out = new Set<string>();
  let depth = 0, inside = false, inBlock = false;
  for (const raw of src.split('\n')) {
    let line = raw;
    if (inBlock) {
      const e = line.indexOf('*/');
      if (e < 0) continue;
      line = line.slice(e + 2);
      inBlock = false;
    }
    const b = line.indexOf('/*');
    if (b >= 0) {
      const e = line.indexOf('*/', b);
      if (e < 0) { line = line.slice(0, b); inBlock = true; } else line = line.slice(0, b) + line.slice(e + 2);
    }
    line = line.replace(/\/\/.*$/, '').trim();
    if (!line) continue;
    if (depth === 0 && new RegExp(`^export\\s+interface\\s+${iface}\\b`).test(line)) inside = true;
    if (inside && depth >= 1) {
      const p = line.match(/^(\w+)\??\s*:/);
      if (p) out.add(p[1]);
    }
    depth += (line.match(/[{[]/g) || []).length - (line.match(/[}\]]/g) || []).length;
    if (depth <= 0) { depth = 0; if (inside) inside = false; }
  }
  return out;
}
