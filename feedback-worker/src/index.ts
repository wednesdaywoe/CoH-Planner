/**
 * CoH Planner Feedback Worker
 *
 * Receives feedback form submissions and sends formatted emails via Resend.
 * Deploy: `wrangler deploy`
 * Secrets: `wrangler secret put RESEND_API_KEY` and `wrangler secret put FEEDBACK_EMAIL`
 */

interface Env {
  RESEND_API_KEY: string;
  FEEDBACK_EMAIL: string;
}

interface BuildContext {
  archetype: string;
  level: number;
  primary: string;
  secondary: string;
  pools: string[];
  epicPool: string | null;
  powerCount: number;
  slotCount: number;
}

interface FeedbackPayload {
  type: 'bug' | 'suggestion' | 'other';
  description: string;
  globalName?: string;
  buildContext?: BuildContext;
  userAgent: string;
  timestamp: string;
}

const ALLOWED_ORIGINS = [
  'https://coh-sidekick.com',
  'https://wednesdaywoe.github.io',
  'http://localhost:3000',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(payload: FeedbackPayload): string {
  const typeLabel: Record<string, string> = {
    bug: 'Bug Report',
    suggestion: 'Feature Suggestion',
    other: 'General Feedback',
  };

  const typeColor: Record<string, string> = {
    bug: '#ef4444',
    suggestion: '#3b82f6',
    other: '#8b5cf6',
  };

  const label = typeLabel[payload.type] || 'Feedback';
  const color = typeColor[payload.type] || '#8b5cf6';

  let contextHtml = '';
  if (payload.buildContext) {
    const ctx = payload.buildContext;
    contextHtml = `
      <h3 style="color: #94a3b8; margin-top: 16px;">Build Context</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="color: #64748b; padding: 4px 8px;">Archetype</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.archetype)}</td></tr>
        <tr><td style="color: #64748b; padding: 4px 8px;">Level</td><td style="color: #e2e8f0; padding: 4px 8px;">${ctx.level}</td></tr>
        <tr><td style="color: #64748b; padding: 4px 8px;">Primary</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.primary)}</td></tr>
        <tr><td style="color: #64748b; padding: 4px 8px;">Secondary</td><td style="color: #e2e8f0; padding: 4px 8px;">${escapeHtml(ctx.secondary)}</td></tr>
        <tr><td style="color: #64748b; padding: 4px 8px;">Pools</td><td style="color: #e2e8f0; padding: 4px 8px;">${ctx.pools.length > 0 ? ctx.pools.map(escapeHtml).join(', ') : 'None'}</td></tr>
        <tr><td style="color: #64748b; padding: 4px 8px;">Epic Pool</td><td style="color: #e2e8f0; padding: 4px 8px;">${ctx.epicPool ? escapeHtml(ctx.epicPool) : 'None'}</td></tr>
        <tr><td style="color: #64748b; padding: 4px 8px;">Powers / Slots</td><td style="color: #e2e8f0; padding: 4px 8px;">${ctx.powerCount} / ${ctx.slotCount}</td></tr>
      </table>`;
  }

  let contactHtml = '';
  if (payload.globalName) {
    contactHtml = `
      <h3 style="color: #94a3b8; margin-top: 16px;">Global Name</h3>
      <p style="color: #60a5fa;">${escapeHtml(payload.globalName)}</p>`;
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${color}; color: white; padding: 12px 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">${label}</h2>
      </div>
      <div style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
        <h3 style="color: #94a3b8; margin-top: 0;">Description</h3>
        <p style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(payload.description)}</p>
        ${contactHtml}
        ${contextHtml}
        <hr style="border: none; border-top: 1px solid #334155; margin: 16px 0;" />
        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
          Sent: ${escapeHtml(payload.timestamp)}<br/>
          UA: ${escapeHtml(payload.userAgent)}
        </p>
      </div>
    </div>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate origin in production
    const isAllowed = origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let payload: FeedbackPayload;
    try {
      payload = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!payload.description?.trim() || !payload.type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!['bug', 'suggestion', 'other'].includes(payload.type)) {
      return new Response(JSON.stringify({ error: 'Invalid feedback type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Truncate description to prevent abuse
    const description = payload.description.substring(0, 5000);
    // Remove newlines from subject (email subjects must be single-line)
    const subjectPreview = description.substring(0, 60).replace(/[\r\n]+/g, ' ').trim();
    const subject = `[CoH Planner] ${payload.type}: ${subjectPreview}${description.length > 60 ? '...' : ''}`;

    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CoH Planner <onboarding@resend.dev>',
          to: env.FEEDBACK_EMAIL,
          subject,
          html: buildEmailHtml({ ...payload, description }),
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error('Resend error:', error);
        return new Response(JSON.stringify({ error: 'Failed to send feedback' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
