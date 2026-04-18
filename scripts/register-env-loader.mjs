/**
 * Registers the env-loader hook so that import.meta.env is available
 * for Vite-authored code running under tsx/Node.
 *
 * Usage: tsx --import ./scripts/register-env-loader.mjs scripts/your-script.ts
 */
import { register } from 'node:module';

// import.meta.url is already a file:// URL; pass it directly as the parent URL.
register('./env-loader.ts', import.meta.url);
