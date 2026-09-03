/**
 * Supabase Edge Function: get-build
 *
 * Point lookup of a single shared build by its exact id. This is the ONLY
 * path a non-owner reads an unlisted build through — RLS grants unlisted
 * rows no anon/authenticated read access (see schema.sql), because a looser
 * policy would make them bulk-listable by anyone holding the public anon
 * key. This function only ever accepts one id and never a filter/listing
 * parameter, so it cannot be used to enumerate unlisted builds.
 *
 * Visibility rules:
 *   - 'public' or 'unlisted': readable by anyone who has the id.
 *   - 'private': readable only by the authenticated owner.
 *   - unknown id, or private and not the owner: 404 (same response either
 *     way — a 403 would confirm the id exists).
 *
 * Deploy with: supabase functions deploy get-build
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Extract authenticated user ID from JWT in Authorization header (if present) */
async function getUserIdFromAuth(
  req: Request,
  supabaseUrl: string,
  supabaseServiceKey: string,
): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user } } = await supabase.auth.getUser(token);
    return user?.id ?? null;
  } catch {
    return null;
  }
}

function notFound() {
  return new Response(
    JSON.stringify({ error: 'Build not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { id } = await req.json();

    if (!id || typeof id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Build ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authUserId = await getUserIdFromAuth(req, supabaseUrl, supabaseServiceKey);

    const { data: build } = await supabase
      .from('shared_builds_with_author')
      .select('*')
      .eq('id', id)
      .single();

    if (!build) return notFound();

    const readable = build.visibility === 'public'
      || build.visibility === 'unlisted'
      || (build.visibility === 'private' && authUserId !== null && build.user_id === authUserId);

    if (!readable) return notFound();

    // Point reads don't count toward the public view counter — that's
    // incremented separately via the increment_views RPC, which any client
    // (including anon, via RLS-visible public rows) can already call.
    return new Response(
      JSON.stringify(build),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
