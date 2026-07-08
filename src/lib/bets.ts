// User bets store, persisted in chrome.storage.local (falls back to memory in
// non-extension contexts like a plain browser tab during dev).

import type { Bet } from './types';
import { MOCK_BETS } from './mock';

const KEY = 'betjet:bets';

const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local;

let memory: Bet[] | null = null;

export async function getBets(): Promise<Bet[]> {
  if (hasChromeStorage) {
    const res = await chrome.storage.local.get(KEY);
    const bets = res[KEY] as Bet[] | undefined;
    if (bets && bets.length) return bets;
    // Seed demo bets on first run so the widget has something to show.
    await chrome.storage.local.set({ [KEY]: MOCK_BETS });
    return MOCK_BETS;
  }
  if (memory === null) memory = [...MOCK_BETS];
  return memory;
}

export async function addBet(bet: Bet): Promise<void> {
  const bets = await getBets();
  const next = [...bets, bet];
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: next });
  else memory = next;
}

export async function setBets(bets: Bet[]): Promise<void> {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: bets });
  else memory = bets;
}
