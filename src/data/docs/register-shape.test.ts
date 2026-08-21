/**
 * register-shape.test.ts — the data-gap register is a checklist, not a story.
 *
 * The register's own header rule says closed entries "keep their narrative in
 * docs/gaps/" and the frontier "stays a pointer list and doesn't accumulate
 * closure prose." That rule has been outgrown twice: the file reached 5,300
 * lines before its 2026-08-11 split, and the "Recent closures" wall (13 KB of
 * closure narrative) grew back the very next commit. scripts/lint-register-shape.cjs
 * makes the shape measurable; this guard is what fails CI when it drifts.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const lint = path.join(root, 'scripts', 'lint-register-shape.cjs');

describe('docs/DATA-GAP-REGISTER.md shape', () => {
  it('is a checklist: no prose rows, counts honest, frontier bounded, every id narrated in docs/gaps/', () => {
    expect(() => execFileSync('node', [lint, '--gate'], { encoding: 'utf8' })).not.toThrow();
  });
});
