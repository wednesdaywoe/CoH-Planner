/**
 * URL fragment encoding/decoding for Homecoming direct build import.
 *
 * Format: deflate (raw, RFC 1951) → base64 → URL fragment
 * Also supports uncompressed base64 JSON as a fallback.
 */

import pako from 'pako';

/**
 * Decode a URL fragment into a JSON string.
 * Tries: base64 → inflate → text. If inflate fails, tries plain base64 → text.
 */
export function decodeImportFragment(fragment: string): string {
  if (!fragment) {
    throw new Error('No build data in URL');
  }

  // Strip leading # if present
  const encoded = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  if (!encoded) {
    throw new Error('No build data in URL');
  }

  // Decode base64 (support both standard and URL-safe variants)
  const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // Try raw inflate first (compressed)
  try {
    const inflated = pako.inflateRaw(bytes);
    return new TextDecoder().decode(inflated);
  } catch {
    // Fall back to plain base64 (uncompressed)
  }

  // Try zlib inflate (in case they use zlib wrapper instead of raw)
  try {
    const inflated = pako.inflate(bytes);
    return new TextDecoder().decode(inflated);
  } catch {
    // Fall back to plain base64
  }

  // Plain base64-encoded JSON (no compression)
  const text = new TextDecoder().decode(bytes);
  if (text.startsWith('{')) {
    return text;
  }

  throw new Error('Could not decode build data — invalid format');
}

/**
 * Encode a JSON string into a URL fragment.
 * Uses raw deflate → base64.
 */
export function encodeImportFragment(json: string): string {
  const bytes = new TextEncoder().encode(json);
  const compressed = pako.deflateRaw(bytes);
  let binary = '';
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return btoa(binary);
}
