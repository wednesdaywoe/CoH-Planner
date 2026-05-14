import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App'
import { loadDataset } from '@/data/dataset'

// Register window.cohDebug for calculation debug logging + fallback warnings
import '@/utils/calc-debug'
import '@/utils/fallback-warnings'

// Sentry — production only. DSN is injected at build time; if it's missing
// the init is a no-op so dev/local builds stay silent.
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
  })
}

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold text-slate-100">Something went wrong</h1>
        <p className="text-sm text-slate-400">
          Sidekick hit an unexpected error and couldn't render. The issue has been reported.
          Try reloading the page — if it keeps happening, you can clear local storage from
          Settings or send feedback.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium"
        >
          Reload
        </button>
      </div>
    </div>
  )
}

// Handle .skif files opened via PWA file association
if ('launchQueue' in window) {
  (window as any).launchQueue.setConsumer(async (launchParams: any) => {
    for (const fileHandle of launchParams.files) {
      const file = await fileHandle.getFile();
      const text = await file.text();
      try {
        const { useBuildStore } = await import('./stores/buildStore');
        useBuildStore.getState().importBuild(text);
      } catch {
        console.error('Failed to import .skif file');
      }
    }
  });
}

// Load the active dataset before mounting React. The data-layer facades
// (e.g. @/data/at-tables, @/data/archetypes) read from the active dataset
// synchronously, so they must not be touched until this resolves.
//
// Resolution order:
//   1. `?serverId=<id>` URL query param (dev/QA override).
//   2. Pre-peek at the persisted Zustand store so the saved build's
//      dataset loads first and we don't flash the wrong one.
//   3. Default to Homecoming.
function bootServerId(): 'homecoming' | 'rebirth' {
  try {
    const param = new URLSearchParams(window.location.search).get('serverId');
    if (param === 'rebirth' || param === 'homecoming') return param;
    const raw = localStorage.getItem('coh-planner-build');
    if (!raw) return 'homecoming';
    const parsed = JSON.parse(raw);
    const id = parsed?.state?.build?.serverId;
    return id === 'rebirth' ? 'rebirth' : 'homecoming';
  } catch {
    return 'homecoming';
  }
}

loadDataset(bootServerId()).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
        <App />
      </Sentry.ErrorBoundary>
    </StrictMode>,
  )
})
