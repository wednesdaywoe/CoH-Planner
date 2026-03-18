import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
