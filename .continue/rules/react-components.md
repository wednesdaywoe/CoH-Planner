---
name: React & Components
description: Conventions for React components, state, and styling.
globs:
  - "src/components/**"
  - "src/pages/**"
  - "src/hooks/**"
  - "src/stores/**"
---

# React & Components

## Components
- Function components with hooks only. TypeScript strict — type props explicitly, avoid `any`.
- Match the domain folder structure: put new UI in the right `components/<domain>/` folder; reuse `components/ui/` primitives (`Button`, `Select`, `Toggle`, `Tooltip`, …) rather than rolling new ones.
- Styling is **Tailwind utility classes** only (dark theme). No CSS modules or inline style objects unless an existing sibling does it.

## State (Zustand)
- Global state lives in `src/stores/` (`buildStore`, `uiStore`, `authStore`, `historyStore`, `onboardingStore`). Select narrowly from stores to avoid needless re-renders.
- `buildStore` persists to localStorage with `skipHydration: true`; hydration is gated by the boot sequence in `main.tsx`. **Don't auto-hydrate or read game data at import time** — the active dataset must load first.
- Keep derived/computed values in selectors or `utils/`, not duplicated across components.

## Data access
- Read game data through the `@/data/*` facades, never by reaching into `data/datasets/<server>/` directly.
