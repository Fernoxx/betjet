// Orchestrates a WidgetSnapshot: fetch live sports markets (Gamma) + user bets,
// cross-check, and fall back to mock data on any failure so the UI always renders.

import type { WidgetSnapshot } from './types';
import { fetchSportsMatches } from './polymarket';
import { getBets } from './bets';
import { buildSnapshot } from './snapshot';
import { MOCK_MATCHES } from './mock';

const CACHE_KEY = 'betjet:snapshot';

export async function computeSnapshot(signal?: AbortSignal): Promise<WidgetSnapshot> {
  const bets = await getBets();
  try {
    const matches = await fetchSportsMatches(signal);
    const snap = buildSnapshot(matches, bets, 'live');
    // If nothing is live from the real feed, still show the demo so the widget
    // isn't empty during development / off-season lulls.
    if (snap.predictions.length === 0) {
      return buildSnapshot(MOCK_MATCHES, bets, 'mock');
    }
    return snap;
  } catch {
    return buildSnapshot(MOCK_MATCHES, bets, 'mock');
  }
}

export async function cacheSnapshot(snap: WidgetSnapshot): Promise<void> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    await chrome.storage.local.set({ [CACHE_KEY]: snap });
  }
}

export async function readCachedSnapshot(): Promise<WidgetSnapshot | null> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    const res = await chrome.storage.local.get(CACHE_KEY);
    return (res[CACHE_KEY] as WidgetSnapshot) ?? null;
  }
  return null;
}

export { CACHE_KEY };
