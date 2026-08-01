import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildDocumentTitle, DEFAULT_DOCUMENT_TITLE } from './document-title';
import { DEFAULT_BUILD_NAME } from '@/types/build';

describe('DEFAULT_DOCUMENT_TITLE', () => {
  // The restore-on-unmount path writes this constant back over whatever a page
  // set, so if it drifts from index.html the app silently retitles itself to a
  // string that was never the real default.
  it('matches the <title> shipped in index.html', () => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8');
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    expect(title).toBe(DEFAULT_DOCUMENT_TITLE);
  });
});

describe('buildDocumentTitle', () => {
  const identity = {
    name: 'Ember Vex',
    archetypeName: 'Blaster',
    primaryName: 'Fire Blast',
    secondaryName: 'Fire Manipulation',
  };

  it('leads with the build name so a truncated bookmark still identifies it', () => {
    expect(buildDocumentTitle(identity)).toBe('Ember Vex — Blaster · Sidekick');
  });

  it('falls back to the powerset pairing when the build is unnamed', () => {
    expect(buildDocumentTitle({ ...identity, name: '' })).toBe(
      'Blaster: Fire Blast/Fire Manipulation · Sidekick',
    );
  });

  // The users who reported identical bookmarks are precisely the ones who never
  // renamed their build, so the factory placeholder must not read as a name.
  it('treats the factory placeholder name as unnamed', () => {
    expect(buildDocumentTitle({ ...identity, name: DEFAULT_BUILD_NAME })).toBe(
      'Blaster: Fire Blast/Fire Manipulation · Sidekick',
    );
  });

  it('treats a whitespace-only name as unnamed', () => {
    expect(buildDocumentTitle({ ...identity, name: '   ' })).toBe(
      'Blaster: Fire Blast/Fire Manipulation · Sidekick',
    );
  });

  it('keeps the default until an archetype is picked', () => {
    expect(buildDocumentTitle({ ...identity, archetypeName: '' })).toBe(DEFAULT_DOCUMENT_TITLE);
  });

  it('omits an unpicked secondary rather than trailing a bare slash', () => {
    expect(buildDocumentTitle({ ...identity, name: '', secondaryName: '' })).toBe(
      'Blaster: Fire Blast · Sidekick',
    );
  });

  it('distinguishes two builds that differ only by name', () => {
    const other = buildDocumentTitle({ ...identity, name: 'Frostline' });
    expect(other).not.toBe(buildDocumentTitle(identity));
  });
});
