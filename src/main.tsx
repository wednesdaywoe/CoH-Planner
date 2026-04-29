import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { loadDataset } from '@/data/dataset'

// Register window.cohDebug for calculation debug logging + fallback warnings
import '@/utils/calc-debug'
import '@/utils/fallback-warnings'

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
// We pre-peek at the persisted Zustand store to figure out which dataset
// the saved build needs — this avoids a flash where the wrong dataset is
// loaded then swapped after Zustand rehydrates. Falls back to Homecoming
// for fresh visitors and for any parse / shape failure.
function persistedServerId(): 'homecoming' | 'rebirth' {
  try {
    const raw = localStorage.getItem('coh-planner-build');
    if (!raw) return 'homecoming';
    const parsed = JSON.parse(raw);
    const id = parsed?.state?.build?.serverId;
    return id === 'rebirth' ? 'rebirth' : 'homecoming';
  } catch {
    return 'homecoming';
  }
}

loadDataset(persistedServerId()).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
