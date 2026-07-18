import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { execSync } from 'child_process'
import { createHash } from 'node:crypto'

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

/**
 * Inject a Content-Security-Policy <meta> into the built index.html.
 *
 * Build-only: GitHub Pages can't set HTTP headers, and dev/HMR relies on inline
 * scripts + eval that a strict CSP would block. The two inline <script> blocks
 * in index.html (the GH-Pages SPA redirect and the serverId loading label) are
 * SHA-256 hashed here automatically, so `script-src` never needs 'unsafe-inline'
 * — and because we hash the *post-transform* HTML, the hashes always match what
 * actually ships (edit the inline scripts freely; the build re-hashes them).
 *
 * The security-critical directive is `connect-src`: even if a dependency were
 * compromised, the browser blocks it from exfiltrating the Supabase session
 * token to any host not on this list. `frame-src` allows the in-app
 * "Support Sidekick" donation iframe (Buy Me a Coffee), which is cross-origin
 * and therefore already walled off from this origin's storage by the browser.
 *
 * Note: `frame-ancestors` (clickjacking) is header-only and ignored in <meta>,
 * so it's omitted — it would need a host that can send response headers.
 */
function cspPlugin(): Plugin {
  return {
    name: 'sidekick-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Match every INLINE <script> (no src= attribute) and hash its body.
        const inlineScript = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi
        const scriptHashes: string[] = []
        for (const match of html.matchAll(inlineScript)) {
          const code = match[1]
          if (!code) continue
          const digest = createHash('sha256').update(code, 'utf8').digest('base64')
          scriptHashes.push(`'sha256-${digest}'`)
        }

        const csp = [
          `default-src 'self'`,
          `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
          // Landing page + Tailwind use inline style="" attributes (un-hashable);
          // fonts.googleapis.com serves the SN Pro / Nunito stylesheet.
          `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
          `font-src 'self' https://fonts.gstatic.com data:`,
          // Same-origin icons + data URIs + OAuth (Discord) / Supabase avatars.
          `img-src 'self' data: https://cdn.discordapp.com https://*.supabase.co`,
          // The complete set of hosts the app legitimately talks to. Anything
          // else (i.e. an exfiltration attempt) is blocked by the browser:
          //   *.supabase.co  — shared builds + auth (REST + realtime websocket)
          //   *.sentry.io    — error reporting
          //   wednesdaywoe.github.io — status banner status.json
          //   ...workers.dev — feedback form endpoint
          `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://wednesdaywoe.github.io https://coh-planner-feedback.wedswoe.workers.dev`,
          // In-app "Support Sidekick" donation iframe.
          `frame-src https://buymeacoffee.com https://www.buymeacoffee.com`,
          `worker-src 'self'`,
          `manifest-src 'self'`,
          `base-uri 'self'`,
          `form-action 'self'`,
          `object-src 'none'`,
        ].join('; ')

        return html.replace(
          /<head>/i,
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        )
      },
    },
  }
}

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
        // Exclude the per-dataset chunks (`dataset-<id>-*.js`, named via
        // build.rollupOptions.output.chunkFileNames). Each is 8-15 MB and only
        // ONE is ever loaded per visitor (the active server, chosen at boot),
        // so precaching all three would download ~34 MB of data on SW install —
        // ~2/3 of it for datasets that visitor never opens. Instead boot loads
        // the active dataset's chunk over the network (content-hashed →
        // immutable → HTTP-cached for repeat loads). Offline dataset switching
        // isn't a goal (no distributable; effectively all use is online).
        globIgnores: ['assets/dataset-*.js'],
        // Precache is now the app shell only (~1.7 MB entry + CSS). This low cap
        // is a regression tripwire: a globbed file over the limit is a hard
        // build error, so if a future change re-leaks a whole dataset (8 MB+)
        // into an eager/precached chunk, the build fails loudly here.
        // History: 16 MiB, then 40 MiB on 2026-07-17 to fit the ~29 MB data
        // chunk that used to be welded into the eager entry; that data now
        // lives in the globIgnored dataset chunks (perf/dataset-lazy-facades).
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
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
    // Keep LAST so its post-transform runs after any other HTML transform,
    // ensuring the inline-script hashes match the final shipped bytes.
    cspPlugin(),
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
    rollupOptions: {
      output: {
        // Give the per-dataset dynamic-import chunks a stable, greppable name
        // (`dataset-<id>-<hash>.js`) so the service worker can exclude them
        // from precache by glob (see workbox.globIgnores). This is naming ONLY
        // — it does NOT move modules between chunks (a directory-based
        // manualChunks would, and would re-pull the ~100 KB of small modules
        // still statically imported from datasets/* back into the eager entry).
        // Each dataset's index.ts is the facade module of its own dynamic chunk.
        chunkFileNames: (chunkInfo) => {
          const id = chunkInfo.facadeModuleId
          const m = id?.match(/[/\\]datasets[/\\](homecoming|rebirth|thunderspy)[/\\]index\.ts$/)
          return m ? `assets/dataset-${m[1]}-[hash].js` : 'assets/[name]-[hash].js'
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
