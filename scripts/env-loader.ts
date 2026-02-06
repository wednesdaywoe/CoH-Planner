/**
 * Custom Node.js module loader hook that provides import.meta.env
 * for Vite-based code running outside of Vite.
 *
 * Usage: npx tsx --import ./scripts/env-loader.ts scripts/export-to-godot.ts
 */

const ENV_SHIM = `
  if (!import.meta.env) {
    import.meta.env = {
      BASE_URL: '/',
      DEV: false,
      PROD: true,
      MODE: 'production',
      SSR: true,
    };
  }
`;

export async function load(
  url: string,
  context: { format?: string },
  nextLoad: Function
) {
  const result = await nextLoad(url, context);

  // For TypeScript/JavaScript source files, prepend the env shim
  if (
    result.format === 'module' &&
    typeof result.source === 'string' &&
    url.includes('/src/')
  ) {
    result.source = ENV_SHIM + result.source;
  }

  return result;
}
