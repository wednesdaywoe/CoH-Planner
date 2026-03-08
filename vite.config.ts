import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const BUILD_TIME = Date.now()

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
    // Inject build timestamp for the WIP banner
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
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
