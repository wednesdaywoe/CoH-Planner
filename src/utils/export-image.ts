/**
 * Image-export helpers — rasterize a DOM node to a PNG and hand it to the user
 * (download or clipboard). Wraps `html-to-image` so the modal doesn't touch the
 * library directly.
 *
 * CSP notes: the app's icons are same-origin (`/img/...`), so html-to-image can
 * inline them via same-origin fetch (`connect-src 'self'`) and emit `data:`
 * URIs (`img-src data:`). We pass `skipFonts: true` — fetching the Google-hosted
 * webfont CSS/files is blocked by `connect-src`, and the card's
 * `system-ui, sans-serif` fallback stack renders cleanly in the SVG rasterizer
 * without embedding. No `blob:`/external network is used.
 */

import { toBlob } from 'html-to-image';

export interface RenderOptions {
  /** Device-pixel multiplier → output resolution. 1 = card's CSS pixels, 2 = retina. */
  scale?: number;
  /** Solid background fill (any CSS color). Omit / `undefined` for transparency. */
  backgroundColor?: string;
}

/**
 * Rasterize `node` to a PNG Blob. `node` should be fully laid out and visible
 * (off-screen positioning is fine, but `display:none` breaks measurement).
 */
export async function renderNodeToPng(node: HTMLElement, options: RenderOptions = {}): Promise<Blob> {
  const { scale = 2, backgroundColor } = options;
  const blob = await toBlob(node, {
    pixelRatio: scale,
    backgroundColor, // undefined ⇒ transparent
    cacheBust: true,
    skipFonts: true,
    // Rasterize at the node's own layout size, independent of any parent
    // transform (the modal preview scales the card down with CSS transform).
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { transform: 'none', margin: '0' },
  });
  if (!blob) throw new Error('Image rendering produced no output');
  return blob;
}

/** Trigger a browser download of `blob` as `filename`. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Turn a build name into a safe file stem (`My Build!` → `my_build`). */
export function slugifyFilename(name: string): string {
  return (name.trim() || 'build').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase() || 'build';
}

/**
 * Copy a PNG Blob to the clipboard. Returns false (rather than throwing) when
 * the browser lacks async-clipboard image support (Firefox, some Safari), so
 * the caller can fall back to the download button.
 */
export async function copyPngToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch (err) {
    console.error('Copy image to clipboard failed:', err);
    return false;
  }
}
