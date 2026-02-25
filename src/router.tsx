/**
 * Router configuration
 *
 * Creates the TanStack Router instance with all routes defined.
 */

import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { PlannerPage, BuildsPage, BuildDetailPage, SettingsPage } from '@/pages';


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

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});



// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  buildsRoute,
  buildDetailRoute,
  settingsRoute,
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
