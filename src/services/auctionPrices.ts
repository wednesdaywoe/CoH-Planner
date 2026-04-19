/**
 * Auction prices service — fetches estimated influence cost for enhancements
 * from the Homecoming auction house via the auction-prices edge function.
 */

import { supabase } from '@/lib/supabase';
import type { Enhancement, IOSetEnhancement } from '@/types';

export interface PriceRow {
  raw_identifier: string;
  avg_price: number | null;
  min_price: number | null;
  max_price: number | null;
  sample_count: number | null;
  last_sale_at: string | null;
  fetched_at: string;
  not_found: boolean;
}

const PIECE_LETTERS = 'abcdef';

/** Well-known raw_identifiers for crafting materials (type 11 / salvage). */
export const MATERIAL_IDENTIFIERS = {
  catalyst: '11 S_EnhancementCatalyst 0',
  booster: '11 S_EnhancementBooster 0',
  converter: '11 S_EnhancementConverter 0',
} as const;

/** Convert "attuned_brutes_fury_a" → "Attuned_Brutes_Fury_A" */
function titleCaseToken(token: string): string {
  return token
    .split('_')
    .map(part => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join('_');
}

/**
 * Build the HC auction `raw_identifier` for a single IO set enhancement.
 * Returns null for piece numbers out of range.
 *
 * Format: `5 Boosts.<Titled>.<Titled> <suffix>`
 *   Titled    = Title_Case of `<prefix>_<setId>_<letter>`
 *   prefix    = attuned | crafted | superior_attuned | superior_crafted
 *   suffix    = 0 for attuned, (level - 1) for crafted
 */
export function ioSetToRawIdentifier(enh: IOSetEnhancement): string | null {
  if (enh.pieceNum < 1 || enh.pieceNum > 6) return null;
  const letter = PIECE_LETTERS[enh.pieceNum - 1];

  const isSuperior = enh.setId.startsWith('superior_');
  const baseKind = enh.attuned ? 'attuned' : 'crafted';
  const prefix = isSuperior ? `superior_${baseKind}` : baseKind;

  const token = `${prefix}_${enh.setId}_${letter}`;
  const titled = titleCaseToken(token);

  const level = enh.level ?? 50;
  const suffix = enh.attuned ? 0 : Math.max(0, level - 1);

  return `5 Boosts.${titled}.${titled} ${suffix}`;
}

/** Return the `raw_identifier` for any enhancement we support pricing for. */
export function enhancementToRawIdentifier(enh: Enhancement): string | null {
  if (enh.type === 'io-set') return ioSetToRawIdentifier(enh);
  return null;
}

/**
 * Fetch prices for a list of raw identifiers. Returns an identifier -> PriceRow map
 * (null entries indicate the item wasn't found on the auction house).
 */
export async function fetchPrices(
  identifiers: string[],
): Promise<Record<string, PriceRow | null>> {
  if (!supabase) throw new Error('Supabase is not configured');
  if (identifiers.length === 0) return {};

  const { data, error } = await supabase.functions.invoke('auction-prices', {
    body: { identifiers },
  });

  if (error) {
    let msg = 'Failed to fetch auction prices';
    try {
      if (error.context && typeof error.context.json === 'function') {
        const body = await error.context.json();
        msg = body?.error || msg;
      } else {
        msg = error.message || msg;
      }
    } catch {
      msg = error.message || msg;
    }
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);

  return (data?.prices ?? {}) as Record<string, PriceRow | null>;
}

/** Format a price as "1.2M" / "450K" / "800" */
export function formatInf(value: number | null | undefined): string {
  if (value == null) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}
