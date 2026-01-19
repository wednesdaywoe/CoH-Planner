import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BUILD_TIME } from './buildTime'

// Update the WIP banner with the build timestamp
const lastUpdatedEl = document.getElementById('last-updated');
if (lastUpdatedEl) {
  const date = new Date(BUILD_TIME);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  lastUpdatedEl.textContent = date.toLocaleString('en-US', options);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
