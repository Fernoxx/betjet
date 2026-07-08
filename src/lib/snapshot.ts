// Build the WidgetSnapshot the UI renders from live matches + the user's bets.
//
// Rules (from the product spec):
//   - Only ever surface predictions on matches that are LIVE right now.
//   - If the user has bets on a live match, show those (their odds + PnL).
//   - If no betted match is live, fall back to "discover" mode: show predictions
//     from currently-live matches so the user can place a bet.

import type { Bet, Match, Prediction, WidgetSnapshot } from './types';
import { liveSource } from './live';
import { countryCodeForLabel } from './flags';

function priceOf(match: Match, tokenId: string): number | null {
  for (const mk of match.markets) {
    const o = mk.outcomes.find((x) => x.tokenId === tokenId);
    if (o) return o.price;
  }
  return null;
}

function betToPrediction(bet: Bet, match: Match): Prediction | null {
  const currentPrice = priceOf(match, bet.tokenId);
  if (currentPrice === null) return null;
  const cost = bet.entryPrice * bet.shares;
  const pnl = (currentPrice - bet.entryPrice) * bet.shares;
  const pnlPct = cost > 0 ? pnl / cost : null;
  return {
    matchId: match.id,
    matchTitle: match.title,
    league: match.league,
    marketId: bet.marketId,
    tokenId: bet.tokenId,
    outcomeLabel: bet.outcomeLabel,
    countryCode: bet.countryCode ?? countryCodeForLabel(bet.outcomeLabel),
    currentPrice,
    entryPrice: bet.entryPrice,
    shares: bet.shares,
    isUserBet: true,
    pnl,
    pnlPct,
  };
}

function discoverPredictions(matches: Match[]): Prediction[] {
  const out: Prediction[] = [];
  for (const match of matches) {
    for (const mk of match.markets) {
      for (const o of mk.outcomes) {
        out.push({
          matchId: match.id,
          matchTitle: match.title,
          league: match.league,
          marketId: mk.id,
          tokenId: o.tokenId,
          outcomeLabel: o.label,
          countryCode: o.countryCode,
          currentPrice: o.price,
          entryPrice: null,
          shares: 0,
          isUserBet: false,
          pnl: null,
          pnlPct: null,
        });
      }
    }
  }
  // Most "interesting" first: closest to a coin-flip reads as most in-play.
  return out.sort((a, b) => Math.abs(0.5 - a.currentPrice) - Math.abs(0.5 - b.currentPrice));
}

export function buildSnapshot(
  matches: Match[],
  bets: Bet[],
  source: 'live' | 'mock',
  now = Date.now(),
): WidgetSnapshot {
  const live = liveSource.annotate(matches, now).filter((m) => m.isLive);
  const liveById = new Map(live.map((m) => [m.id, m]));

  const betPredictions: Prediction[] = [];
  for (const bet of bets) {
    const match = liveById.get(bet.matchId);
    if (!match) continue; // bet's match isn't live -> skip
    const p = betToPrediction(bet, match);
    if (p) betPredictions.push(p);
  }

  // Sort user bets by absolute PnL so the biggest mover leads the collapsed pill.
  betPredictions.sort((a, b) => Math.abs(b.pnl ?? 0) - Math.abs(a.pnl ?? 0));

  const hasLiveBets = betPredictions.length > 0;
  const predictions = hasLiveBets ? betPredictions : discoverPredictions(live);
  const totalPnl = hasLiveBets
    ? betPredictions.reduce((sum, p) => sum + (p.pnl ?? 0), 0)
    : null;

  return {
    predictions,
    hasLiveBets,
    totalPnl,
    source,
    updatedAt: now,
  };
}
