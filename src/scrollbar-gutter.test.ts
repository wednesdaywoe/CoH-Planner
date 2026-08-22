import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// A deletion tripwire, not a proof. It cannot check that the page stops shifting — jsdom has
// no layout and vitest has no scrollbars. What it does is make the rule's removal a failing
// test rather than a silent regression, and carry the reason to whoever trips it, because the
// rule reads like dead styling and its replacement (`scrollbar-gutter: stable`) reads like a
// strictly better version of it.
//
// Measured against the running app with real 15px scrollbars: the POWER INFO panel is in
// normal page flow, so hovering different powers ran the document 1118 → 1386px. On a
// viewport inside that band the scrollbar toggles under the pointer and the whole app moves
// 15px left and back. `scrollbar-gutter: stable` computes but reserves nothing on this page;
// `overflow-y: scroll` holds, and also holds while a modal has body scroll locked.
describe('the document keeps its scrollbar track reserved', () => {
  const css = readFileSync(resolve(__dirname, 'index.css'), 'utf-8');

  it('index.css pins the html scroller', () => {
    // Tolerant of formatting, strict about the declaration landing on `html`.
    const htmlBlock = css.match(/(^|\n)html\s*\{([^}]*)\}/);
    expect(htmlBlock, 'no `html { … }` block in index.css').not.toBeNull();
    expect(htmlBlock![2]).toMatch(/overflow-y:\s*scroll/);
  });

  it('the rule still carries its reason', () => {
    // The measurement is the whole argument for keeping a rule that otherwise looks
    // removable, so losing the comment is losing the fix's defence.
    expect(css).toMatch(/scrollbar-gutter: stable/);
    expect(css).toMatch(/POWER INFO panel/);
  });
});
