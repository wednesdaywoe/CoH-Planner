/**
 * SettingsLayout — chrome shared by all `/settings/*` pages.
 *
 * Renders the page heading + tab navigation, with sub-pages mounted via
 * <Outlet />. Add new tabs by appending to TABS and creating the matching
 * route in router.tsx.
 */

import { Link, Outlet } from '@tanstack/react-router';

const TABS = [
  { to: '/settings', label: 'General', exact: true },
  { to: '/settings/profile', label: 'Profile', exact: false },
] as const;

export function SettingsLayout() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <nav className="flex gap-1 mb-6 border-b border-gray-700">
        {TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.exact }}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white border-b-2 border-transparent transition-colors -mb-px"
            activeProps={{
              className:
                'px-3 py-2 text-sm text-white border-b-2 border-blue-500 transition-colors -mb-px',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
