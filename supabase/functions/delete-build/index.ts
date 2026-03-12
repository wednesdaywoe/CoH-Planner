/**
 * Supabase Edge Function: delete-build
 *
 * Deletes a shared build after verifying ownership via owner token
 * or authenticated user identity (Discord OAuth).
 *
 * Deploy with: supabase functions deploy delete-build
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** SHA-256 hash a string, returning hex digest */
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Extract authenticated user ID from JWT in Authorization header */
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { id, owner_token } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Build ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract authenticated user (if logged in)
    const authUserId = await getUserIdFromAuth(req, supabaseUrl, supabaseServiceKey);

    if (!owner_token && !authUserId) {
      return new Response(
        JSON.stringify({ error: 'Owner token or authentication required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify ownership via owner token OR authenticated user
    let authorized = false;

    if (owner_token) {
      const tokenHash = await sha256(owner_token);
      const { data: byToken } = await supabase
        .from('shared_builds')
        .select('id')
        .eq('id', id)
        .eq('owner_token_hash', tokenHash)
        .single();
      if (byToken) authorized = true;
    }

    if (!authorized && authUserId) {
      const { data: byUser } = await supabase
        .from('shared_builds')
        .select('id')
        .eq('id', id)
        .eq('user_id', authUserId)
        .single();
      if (byUser) authorized = true;
    }

    if (!authorized) {
      return new Response(
        JSON.stringify({ error: 'Build not found or not authorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: deleteError } = await supabase
      .from('shared_builds')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete build' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
