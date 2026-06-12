import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { execSync } from 'child_process'

const BUILD_TIME = Date.now()

/** Parse git log into changelog entries for injection at build time */
function getChangelogData(): string {
  try {
    const raw = execSync('git log --format="%H|%aI|%s" --no-merges -200', {
      encoding: 'utf-8',
      cwd: __dirname,
    }).trim()

    const entries = raw.split('\n').filter(Boolean).map(line => {
      const [hash, date, ...rest] = line.split('|')
      let message = rest.join('|') // subject may contain |
      let type = 'update'

      // Extract conventional commit prefix
      const prefixMatch = message.match(/^(feat|fix|refactor|chore|docs|ci|style|test|perf)(\(.+?\))?:\s*/i)
      if (prefixMatch) {
        const prefix = prefixMatch[1].toLowerCase()
        type = prefix === 'feat' ? 'feat' : prefix === 'fix' ? 'fix' : 'update'
        message = message.slice(prefixMatch[0].length)
      }

      // Clean up message
      message = message.replace(/Co-Authored-By:.*/gi, '').trim()
      if (message.length > 0) {
        message = message.charAt(0).toUpperCase() + message.slice(1)
      }

      return { hash: hash.slice(0, 7), date: date.split('T')[0], message, type }
    })

    return JSON.stringify(entries)
  } catch {
    // Fallback if git is unavailable
    return '[]'
  }
}

const CHANGELOG_DATA = getChangelogData()

// https://vite.dev/config/
export default defineConfig({
  // Base path — '/' for custom domain (coh-sidekick.com)
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Controlled updates: a new service worker installs and waits; the app
      // surfaces an "update available" prompt and only activates on user
      // confirmation. Never silently auto-update.
      registerType: 'prompt',
      // Keep the hand-maintained public/manifest.json (it carries the .skif
      // file_handlers entry the generator would not preserve). Don't generate
      // or inject a manifest — index.html already links it.
      manifest: false,
      injectRegister: null,
      workbox: {
        // Precache the app shell only: JS, CSS, HTML. Deliberately NOT images —
        // public/img holds hundreds of enhancement/archetype icons; precaching
        // them would download the entire icon library on SW install. They are
        // runtime-cached on demand below instead.
        globPatterns: ['**/*.{js,css,html}'],
        // The dataset bundle is a large JS chunk (~11 MB) that boot must load
        // before the app can render — so it's downloaded on first load anyway,
        // and precaching it adds ~no first-load cost while enabling offline +
        // instant repeat loads. Raise the per-file cap above it (Workbox's 2 MiB
        // default would drop it from the precache and fail the build). Revisit
        // if the bundle keeps growing — at some point runtime-caching the data
        // chunk on demand beats precaching it.
        maximumFileSizeToCacheInBytes: 16 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        // SPA navigations are served the precached index.html — instant + works
        // offline. Freshness is governed by the controlled update prompt (the
        // waiting SW carries the new shell), so navigations are precache-backed
        // rather than NetworkFirst. See "Sidekick reliability plan.md".
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Same-origin images (the /img icon library). CacheFirst with an
            // entry cap + TTL so the cache can't grow unbounded.
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'sidekick-images',
              expiration: {
                maxEntries: 600,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      // The status banner's status.json is fetched cross-origin from the
      // separate status repo, so the SW never intercepts or caches it — no rule
      // needed. version.json polling has been removed in favour of this SW's
      // own update lifecycle.
    }),
    // Sentry source map upload — only loaded when SENTRY_AUTH_TOKEN is set
    // (i.e. CI builds). Skipping it locally avoids needing the token and
    // sidesteps any network activity from the plugin during dev builds.
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [sentryVitePlugin({
          org: 'wednesdaywoe',
          project: 'coh-sidekick',
          authToken: process.env.SENTRY_AUTH_TOKEN,
        })]
      : []),
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
    __CHANGELOG_DATA__: CHANGELOG_DATA,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      // Plasmic/SSR aliases removed
    },
  },
  // Serve public folder for static assets (img folder is inside public/)
  publicDir: 'public',
  build: {
    outDir: 'dist',
    // 'hidden' generates source maps for Sentry upload without exposing a
    // sourceMappingURL comment in the deployed JS (so browsers won't fetch
    // the maps from the public site).
    sourcemap: 'hidden',
  },
  server: {
    port: 3000,
    open: true,
  },
})
