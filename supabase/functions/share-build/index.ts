/**
 * Supabase Edge Function: share-build
 *
 * Validates build data, applies rate limiting, generates a short ID,
 * and inserts the shared build into the database.
 *
 * Supports both creating new builds and updating existing ones via owner token
 * or authenticated user identity (Discord OAuth).
 *
 * Deploy with: supabase functions deploy share-build
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { nanoid } from 'https://esm.sh/nanoid@5';

const SHARE_RATE_LIMIT = 5;  // max public shares per hour
const VAULT_RATE_LIMIT = 20; // max vault saves per hour
const RATE_WINDOW_HOURS = 1;

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

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // ---- Extract authenticated user (if logged in via Discord OAuth) ----
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authUserId = await getUserIdFromAuth(req, supabaseUrl, supabaseServiceKey);

    const isUpdate = !!(body.existing_id && (body.owner_token || authUserId));

    // is_public defaults to true; only authenticated users may create private builds
    const isPublic: boolean = body.is_public === false ? (authUserId !== null) : true;

    // ---- Validate required fields ----
    const { name, archetype, archetype_name, primary_set, primary_name, secondary_set, secondary_name, level, build_json } = body;

    if (!archetype || !primary_set || !secondary_set) {
      return new Response(
        JSON.stringify({ error: 'Build must have an archetype, primary, and secondary powerset' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!build_json || !build_json.version || !build_json.build) {
      return new Response(
        JSON.stringify({ error: 'Invalid build data format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const buildLevel = typeof level === 'number' ? level : 50;
    if (buildLevel < 1 || buildLevel > 50) {
      return new Response(
        JSON.stringify({ error: 'Level must be between 1 and 50' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ---- Supabase client (service role for inserts) ----
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ---- Rate limiting ----
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('cf-connecting-ip')
      ?? 'unknown';

    const windowStart = new Date(Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    // Vault saves and public shares use separate rate limit buckets
    const rateLimitAction = isPublic ? 'share' : 'vault';
    const rateLimit = isPublic ? SHARE_RATE_LIMIT : VAULT_RATE_LIMIT;

    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip', clientIp)
      .eq('action', rateLimitAction)
      .gte('created_at', windowStart);

    if ((count ?? 0) >= rateLimit) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record this request for rate limiting
    await supabase.from('rate_limits').insert({ ip: clientIp, action: rateLimitAction });

    const tags = Array.isArray(body.tags)
      ? body.tags.filter((t: unknown) => typeof t === 'string').slice(0, 10)
      : [];

    const buildData = {
      name: (name?.trim() || `${primary_name || 'Unknown'}/${secondary_name || 'Unknown'} ${archetype_name || 'Build'}`).slice(0, 200),
      description: (body.description || '').slice(0, 500),
      archetype,
      archetype_name: (archetype_name || '').slice(0, 100),
      primary_set,
      primary_name: (primary_name || '').slice(0, 100),
      secondary_set,
      secondary_name: (secondary_name || '').slice(0, 100),
      level: buildLevel,
      author_name: (body.author_name || '').slice(0, 50),
      server: (body.server || '').slice(0, 50),
      tags,
      build_json,
      is_public: isPublic,
    };

    // ---- UPDATE existing build ----
    if (isUpdate) {
      // Verify ownership via owner token OR authenticated user
      let authorized = false;

      if (body.owner_token) {
        const tokenHash = await sha256(body.owner_token);
        const { data: byToken } = await supabase
          .from('shared_builds')
          .select('id')
          .eq('id', body.existing_id)
          .eq('owner_token_hash', tokenHash)
          .single();
        if (byToken) authorized = true;
      }

      if (!authorized && authUserId) {
        const { data: byUser } = await supabase
          .from('shared_builds')
          .select('id')
          .eq('id', body.existing_id)
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

      const { error: updateError } = await supabase
        .from('shared_builds')
        .update({ ...buildData, updated_at: new Date().toISOString() })
        .eq('id', body.existing_id);

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update build' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ id: body.existing_id, url: `/builds/${body.existing_id}`, updated: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ---- CREATE new build ----
    const id = nanoid(10);
    const ownerToken = crypto.randomUUID();
    const ownerTokenHash = await sha256(ownerToken);

    const { error: insertError } = await supabase.from('shared_builds').insert({
      id,
      ...buildData,
      owner_token_hash: ownerTokenHash,
      user_id: authUserId,  // null if not logged in, UUID if authenticated
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save build' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ id, url: `/builds/${id}`, owner_token: ownerToken }),
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
