/**
 * Server deeplinks.
 *
 * A `?serverId=<id>` query param makes a visitor land on Sidekick with that
 * dataset loaded (read at boot by `bootServerId` in `main.tsx`). This is the
 * canonical, reusable pattern for any server's launcher/site to deeplink into
 * the planner for their dataset — e.g. Rebirth's launcher linking to
 * `https://<host>/?serverId=rebirth`.
 *
 * It's safe to hand out: per-server build storage means following the link
 * never discards a build the visitor has on another server (each server keeps
 * its own working build), and it needs no account.
 */

import type { ServerId } from '@/utils/per-server-builds';

/**
 * Build an absolute deeplink that lands on `serverId`'s dataset.
 *
 * @param serverId  target dataset id (`homecoming` | `rebirth` | `thunderspy` | …).
 * @param base      base URL to hang the param on. Defaults to the current app
 *                  origin + base path, so links are correct under any deploy
 *                  path. Pass an explicit base for SSR / external generation.
 */
export function serverDeeplink(serverId: ServerId, base?: string): string {
  const hasWindow = typeof window !== 'undefined';
  const fallbackBase = hasWindow
    ? window.location.origin + (import.meta.env.BASE_URL || '/')
    : '/';
  const href = hasWindow ? window.location.href : 'http://localhost/';
  const url = new URL(base ?? fallbackBase, href);
  url.searchParams.set('serverId', serverId);
  url.hash = '';
  return url.toString();
}
