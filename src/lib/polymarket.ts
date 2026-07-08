// Polymarket API client.
//
// Read paths used here (all public, no auth):
//   - Gamma    https://gamma-api.polymarket.com   markets/events/odds metadata
//   - Data API https://data-api.polymarket.com     positions for a wallet address
//
// Trading (posting signed CLOB orders) lives in trade.ts; this module is
// read-only market + position data.

import type { Market, Match, Outcome } from './types';
import { countryCodeForLabel } from './flags';

const GAMMA = 'https://gamma-api.polymarket.com';
const DATA = 'https://data-api.polymarket.com';

// Gamma tag ids for sports verticals. Soccer is the primary target; the list is
// intentionally small and easy to extend.
const SPORTS_TAG_IDS = [1, 100639]; // 1 = Sports (broad), plus soccer-ish subtags

// Gamma serializes several fields as JSON strings; parse defensively.
function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

interface GammaMarket {
  id?: string | number;
  conditionId?: string;
  question?: string;
  outcomes?: unknown; // JSON string array
  outcomePrices?: unknown; // JSON string array
  clobTokenIds?: unknown; // JSON string array
  active?: boolean;
  closed?: boolean;
}

interface GammaEvent {
  id?: string | number;
  title?: string;
  startDate?: string;
  endDate?: string;
  closed?: boolean;
  active?: boolean;
  tags?: Array<{ id?: number | string; label?: string; slug?: string }>;
  markets?: GammaMarket[];
}

function mapGammaMarket(gm: GammaMarket): Market | null {
  const labels = parseJsonArray(gm.outcomes);
  const prices = parseJsonArray(gm.outcomePrices).map(Number);
  const tokenIds = parseJsonArray(gm.clobTokenIds);
  if (labels.length === 0 || labels.length !== tokenIds.length) return null;

  const outcomes: Outcome[] = labels.map((label, i) => ({
    tokenId: tokenIds[i],
    label,
    countryCode: countryCodeForLabel(label),
    price: Number.isFinite(prices[i]) ? prices[i] : 0,
  }));

  return {
    id: String(gm.conditionId ?? gm.id ?? ''),
    question: gm.question ?? '',
    outcomes,
  };
}

function mapGammaEvent(ev: GammaEvent): Match | null {
  const markets = (ev.markets ?? [])
    .filter((m) => m.active !== false && m.closed !== true)
    .map(mapGammaMarket)
    .filter((m): m is Market => m !== null && m.outcomes.length > 0);
  if (markets.length === 0) return null;

  const startTime = ev.startDate ? Date.parse(ev.startDate) : NaN;
  return {
    id: String(ev.id ?? ''),
    title: ev.title ?? 'Match',
    league: ev.tags?.find((t) => t.slug && t.slug !== 'sports')?.label ?? ev.tags?.[0]?.label,
    startTime: Number.isFinite(startTime) ? startTime : Date.now(),
    isLive: false, // decided later by live.ts
    markets,
  };
}

/** Fetch open sports events and map them to Match[]. Throws on network error. */
export async function fetchSportsMatches(signal?: AbortSignal): Promise<Match[]> {
  const params = new URLSearchParams({ closed: 'false', limit: '80', order: 'startDate' });
  for (const id of SPORTS_TAG_IDS) params.append('tag_id', String(id));

  const res = await fetch(`${GAMMA}/events?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`gamma events ${res.status}`);
  const data = (await res.json()) as GammaEvent[];
  if (!Array.isArray(data)) throw new Error('gamma: unexpected shape');

  return data
    .map(mapGammaEvent)
    .filter((m): m is Match => m !== null)
    .sort((a, b) => a.startTime - b.startTime);
}

/** A raw position row from the data API (only fields we use). */
export interface RawPosition {
  asset: string; // tokenId
  conditionId: string;
  size: number; // shares
  avgPrice: number; // entry price [0,1]
  title?: string;
  outcome?: string;
}

/** Fetch the on-chain positions for a wallet address. Throws on network error. */
export async function fetchPositions(address: string, signal?: AbortSignal): Promise<RawPosition[]> {
  const res = await fetch(
    `${DATA}/positions?user=${encodeURIComponent(address)}&sizeThreshold=0.1`,
    { signal },
  );
  if (!res.ok) throw new Error(`data positions ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((p: Record<string, unknown>) => ({
    asset: String(p.asset ?? ''),
    conditionId: String(p.conditionId ?? ''),
    size: Number(p.size ?? 0),
    avgPrice: Number(p.avgPrice ?? 0),
    title: p.title ? String(p.title) : undefined,
    outcome: p.outcome ? String(p.outcome) : undefined,
  }));
}
