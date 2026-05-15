/**
 * Delete all shared_builds rows for a given user_id.
 *
 * Default is a dry count. Pass --confirm to actually delete.
 *
 *   npx tsx --import ./scripts/register-env-loader.mjs \
 *     scripts/delete-user-shared-builds.ts --user-id <uuid>
 *   npx tsx --import ./scripts/register-env-loader.mjs \
 *     scripts/delete-user-shared-builds.ts --user-id <uuid> --confirm
 */

import { parseArgs } from 'node:util';
import { createClient } from '@supabase/supabase-js';

const { values: args } = parseArgs({
  options: {
    'user-id': { type: 'string' },
    confirm: { type: 'boolean', default: false },
  },
  strict: false,
});

const userId = args['user-id'] as string | undefined;
const confirm = Boolean(args.confirm);

if (!userId) {
  console.error('ERROR: --user-id <uuid> is required');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { count, error: countErr } = await supabase
    .from('shared_builds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countErr) {
    console.error('Count failed:', countErr.message);
    process.exit(1);
  }

  console.log(`Found ${count ?? 0} shared_builds row(s) for user_id ${userId}`);

  if (!confirm) {
    console.log('Dry run (no --confirm). Re-run with --confirm to delete.');
    return;
  }

  if ((count ?? 0) === 0) {
    console.log('Nothing to delete.');
    return;
  }

  console.log('Deleting...');
  const { error: delErr } = await supabase
    .from('shared_builds')
    .delete()
    .eq('user_id', userId);

  if (delErr) {
    console.error('Delete failed:', delErr.message);
    process.exit(1);
  }

  const { count: remaining } = await supabase
    .from('shared_builds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  console.log(`Done. Remaining rows for that user_id: ${remaining ?? 0}`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
