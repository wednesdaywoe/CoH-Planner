/**
 * Supabase Edge Function: share-build
 *
 * Validates build data, applies rate limiting, generates a short ID,
 * and inserts the shared build into the database.
 *
 * Deploy with: supabase functions deploy share-build
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { nanoid } from 'https://esm.sh/nanoid@5';

const RATE_LIMIT = 5; // max shares per window
const RATE_WINDOW_HOURS = 1;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ---- Rate limiting ----
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('cf-connecting-ip')
      ?? 'unknown';

    const windowStart = new Date(Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    const { count } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip', clientIp)
      .eq('action', 'share')
      .gte('created_at', windowStart);

    if ((count ?? 0) >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record this request for rate limiting
    await supabase.from('rate_limits').insert({ ip: clientIp, action: 'share' });

    // ---- Generate ID and insert ----
    const id = nanoid(10);

    const tags = Array.isArray(body.tags)
      ? body.tags.filter((t: unknown) => typeof t === 'string').slice(0, 10)
      : [];

    const { error: insertError } = await supabase.from('shared_builds').insert({
      id,
      name: (name || 'Untitled Build').slice(0, 200),
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
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save build' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ id, url: `/builds/${id}` }),
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
