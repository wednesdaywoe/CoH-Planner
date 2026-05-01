/**
 * Router configuration
 *
 * Creates the TanStack Router instance with all routes defined.
 */

import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { SettingsLayout } from '@/components/layout/SettingsLayout';
import {
  PlannerPage,
  BuildsPage,
  BuildDetailPage,
  GeneralSettings,
  ProfileSettingsPage,
  ImportPage,
} from '@/pages';


// Create root route
const rootRoute = createRootRoute({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
});

// Index route (main planner)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PlannerPage,
});

// Builds route
const buildsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/builds',
  component: BuildsPage,
});

// Build detail route (shared build preview)
const buildDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/builds/$id',
  component: BuildDetailPage,
});

// Settings layout (shared chrome for /settings/*)
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsLayout,
});

// /settings index → general settings (account, claim builds, debug toggles)
const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/',
  component: GeneralSettings,
});

// /settings/profile → public profile editor (handle, display name, bio)
const profileSettingsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'profile',
  component: ProfileSettingsPage,
});

// Import route (receives builds from Homecoming game client via URL fragment)
const importRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/import',
  component: ImportPage,
});



// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  buildsRoute,
  buildDetailRoute,
  settingsRoute.addChildren([settingsIndexRoute, profileSettingsRoute]),
  importRoute,
]);

// Create router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  // Use the base path from Vite for GitHub Pages deployment
  basepath: import.meta.env.BASE_URL,
});

// Type declarations for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
