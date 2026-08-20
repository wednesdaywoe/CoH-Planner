/**
 * repo-sync.test.ts — the shared pipeline surface is adjudicated, not assumed.
 *
 * The two repos copy `scripts/` between them by hand. On 2026-08-20 that copy was measured for
 * the first time: 17 of 49 shared scripts differed, and `convert-powerset.cjs` was 714 lines
 * apart with content on both sides the other's history never held. Nothing was watching, so the
 * belief that the pair was byte-identical survived a year of being false. scripts/verify-sync.cjs
 * makes the pair measurable; this is what fails CI when it moves.
 *
 * Solo mode, because it runs in both repos and beta cannot see the private canonical tree. It
 * grades this repo's files against the hashes the shared manifest records for this repo's role,
 * so an edit to a shared file without a manifest re-adjudication is red here. The cross-repo half
 * (are the two manifests even the same file) needs both trees and runs as a paired job in
 * canonical's CI, which already checks beta out for the engine-staleness gate. See FORK-1.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const verify = path.join(root, 'scripts', 'verify-sync.cjs');

describe('shared pipeline surface', () => {
  it('every shared script matches its manifest hash, and every fork names a reason and a gap', () => {
    expect(() => execFileSync('node', [verify, '--gate'], { encoding: 'utf8' })).not.toThrow();
  });
});
