---
name: Project Overview
description: Core stack, structure, and conventions for CoH Sidekick. Always loaded.
alwaysApply: true
---

# CoH Sidekick — Project Overview

City of Heroes character build planner (Homecoming + Rebirth servers), hosted at coh-sidekick.com via GitHub Pages.

## Stack
- **React 18 + TypeScript (strict mode)** — all new files are `.ts`/`.tsx`.
- **Vite 7** build. **Zustand 5** state (localStorage persistence). **TanStack Router**.
- **Tailwind CSS 4** (dark theme, via Vite plugin) — no separate config file; utility classes only.
- **Supabase** backend (shared builds, auth). **Vitest** for tests.
- Path alias: import from `@/...` (maps to `src/...`).

## Project Structure (`src/`)
- `components/` — UI, grouped by domain (`enhancements/`, `incarnate/`, `info/`, `layout/`, `modals/`, `powers/`, `ui/` primitives).
- `data/` — game data. Top-level files (`at-tables.ts`, `archetypes.ts`, …) are **thin facades** that forward to the active dataset. Real data lives under `data/datasets/<server>/`.
- `stores/` — Zustand stores: `buildStore`, `uiStore`, `authStore`, `historyStore`, `onboardingStore`.
- `utils/calculations/` — the ~9,000-line math engine. Treat as the source of truth for stat math.
- `pages/`, `services/` (Supabase wrappers), `hooks/`, `lib/` (Supabase singleton), `types/`.

## Conventions
- Match surrounding code: naming, comment density, idioms. Don't introduce new patterns when an existing one fits.
- Read `ARCHITECTURE.md` for the full picture before large changes.
- Commands: `npm run dev`, `npm run lint` (tsc --noEmit), `npm test` (vitest run), `npm run regen` (regenerate game data).
- A **dataset must be loaded before any `@/data` access** — facades throw otherwise. `main.tsx` enforces load order; don't read game data at module-import time.
