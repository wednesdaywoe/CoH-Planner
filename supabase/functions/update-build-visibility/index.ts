/**
 * Supabase Edge Function: update-build-visibility
 *
 * Toggles the is_public flag on a shared build.
 * Requires Discord OAuth authentication — only the authenticated owner can
 * change visibility. Anonymous (token-only) builds cannot be made private
 * because there is no persistent identity to enforce ownership.
 *
 * Deploy with: supabase functions deploy update-build-visibility
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { id, is_public } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Build ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (typeof is_public !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'is_public must be a boolean' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authentication required — visibility is a login-only feature
    const authUserId = await getUserIdFromAuth(req, supabaseUrl, supabaseServiceKey);
    if (!authUserId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required to change build visibility' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Verify the authenticated user owns this build
    const { data: build } = await supabase
      .from('shared_builds')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', authUserId)
      .single();

    if (!build) {
      return new Response(
        JSON.stringify({ error: 'Build not found or not authorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { error: updateError } = await supabase
      .from('shared_builds')
      .update({ is_public, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update build visibility' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ id, is_public }),
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
