import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
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

/** Write version.json to dist/ after build so the app can poll for updates */
function versionFilePlugin(): Plugin {
  return {
    name: 'version-file',
    writeBundle() {
      fs.writeFileSync(
        path.resolve(__dirname, 'dist/version.json'),
        JSON.stringify({ buildTime: BUILD_TIME })
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Base path — '/' for custom domain (coh-sidekick.com)
  base: '/',
  plugins: [react(), tailwindcss(), versionFilePlugin()],
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
  },
  server: {
    port: 3000,
    open: true,
  },
})
