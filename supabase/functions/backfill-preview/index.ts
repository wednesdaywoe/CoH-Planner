/**
 * Supabase Edge Function: backfill-preview
 *
 * Accepts a preview image captured by a hidden `?previewCapture=` boot for a
 * build that predates the share-preview feature, or was rendered under an
 * older visual template — see streams/BUILD_PREVIEW_BACKFILL_PLAN.md
 * (PREVBF6). No auth: any visitor's browser can be the one that generates
 * it, which is the whole point of "automatic on view". That's bounded on the
 * write side instead — version-gated (never accepts a write when the row's
 * `preview_template_version` is already current) plus a server-side shape
 * check (must decode to exactly 1200×630, under the existing byte cap). See
 * the plan doc's "Decision — anonymous-write security".
 *
 * Deploy with: supabase functions deploy backfill-preview
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mirrors src/components/export-image/BuildPreviewCard.tsx's
// CURRENT_PREVIEW_TEMPLATE_VERSION / PREVIEW_CARD_WIDTH / PREVIEW_CARD_HEIGHT
// and share-build/index.ts's MAX_PREVIEW_IMAGE_BYTES — Deno functions can't
// import frontend TS, so these are hand-kept duplicates. Bump every copy
// together whenever BuildPreviewCard's visual template changes.
const CURRENT_PREVIEW_TEMPLATE_VERSION = 3;
const PREVIEW_CARD_WIDTH = 1200;
const PREVIEW_CARD_HEIGHT = 630;
const MAX_PREVIEW_IMAGE_BYTES = 2 * 1024 * 1024;

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Read width/height from a PNG's IHDR chunk without decoding pixel data.
 *  `null` for anything that isn't a well-formed PNG with IHDR first (true of
 *  every encoder in practice, including the client's `html-to-image`). */
function readPngDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.byteLength < 24) return null;
  for (let i = 0; i < 8; i++) if (bytes[i] !== PNG_SIGNATURE[i]) return null;
  const chunkType = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
  if (chunkType !== 'IHDR') return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16, false), height: view.getUint32(20, false) };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const fail = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const { id, preview_image_base64: base64 } = await req.json();

    if (typeof id !== 'string' || !id) return fail(400, 'Build ID is required');
    if (typeof base64 !== 'string' || base64.length === 0) return fail(400, 'preview_image_base64 is required');

    let bytes: Uint8Array;
    try {
      bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    } catch {
      return fail(400, 'preview_image_base64 is not valid base64');
    }
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_PREVIEW_IMAGE_BYTES) {
      return fail(400, 'Image is empty or too large');
    }
    const dimensions = readPngDimensions(bytes);
    if (!dimensions || dimensions.width !== PREVIEW_CARD_WIDTH || dimensions.height !== PREVIEW_CARD_HEIGHT) {
      return fail(400, `Image must be a ${PREVIEW_CARD_WIDTH}x${PREVIEW_CARD_HEIGHT} PNG`);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: row, error: rowError } = await supabase
      .from('shared_builds')
      .select('visibility, preview_template_version')
      .eq('id', id)
      .maybeSingle();
    if (rowError || !row) return fail(404, 'Build not found');
    if (row.visibility === 'private') return fail(403, 'Build is private');

    const storedVersion = row.preview_template_version as number | null;
    if (storedVersion !== null && storedVersion >= CURRENT_PREVIEW_TEMPLATE_VERSION) {
      // Not an error — just nothing to do. Version-gated write: an owner's
      // real share (share-build) is the only path that overwrites a current
      // image; this one only fills in missing or stale ones.
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const path = `previews/${id}.png`;
    const { error: uploadError } = await supabase.storage
      .from('build-previews')
      .upload(path, bytes, { contentType: 'image/png', upsert: true });
    if (uploadError) {
      console.error('Preview image upload failed:', uploadError);
      return fail(500, 'Failed to upload preview image');
    }

    const { error: updateError } = await supabase
      .from('shared_builds')
      .update({ preview_image_path: path, preview_template_version: CURRENT_PREVIEW_TEMPLATE_VERSION })
      .eq('id', id);
    if (updateError) {
      console.error('Preview backfill update failed:', updateError);
      return fail(500, 'Failed to record preview image');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    return fail(500, 'Internal server error');
  }
});
