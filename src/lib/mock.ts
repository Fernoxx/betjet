// Demo data so the widget renders end-to-end when the Polymarket API is
// unreachable (offline dev, blocked network) or no wallet is connected.

import type { Bet, Match } from './types';
import { countryCodeForLabel } from './flags';

function outcome(label: string, tokenId: string, price: number) {
  return { tokenId, label, countryCode: countryCodeForLabel(label), price };
}

const now = Date.now();

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm-por-esp',
    title: 'Portugal vs Spain',
    league: 'Euro 2028',
    startTime: now - 40 * 60 * 1000, // kicked off 40m ago -> live
    isLive: true,
    markets: [
      {
        id: 'mk-por-esp-winner',
        question: 'Match winner',
        outcomes: [
          outcome('Portugal', 'tok-por', 0.19),
          outcome('Draw', 'tok-draw-1', 0.31),
          outcome('Spain', 'tok-esp', 0.5),
        ],
      },
    ],
  },
  {
    id: 'm-bra-arg',
    title: 'Brazil vs Argentina',
    league: 'Copa America',
    startTime: now - 15 * 60 * 1000,
    isLive: true,
    markets: [
      {
        id: 'mk-bra-arg-winner',
        question: 'Match winner',
        outcomes: [
          outcome('Brazil', 'tok-bra', 0.44),
          outcome('Draw', 'tok-draw-2', 0.28),
          outcome('Argentina', 'tok-arg', 0.28),
        ],
      },
    ],
  },
  {
    id: 'm-fra-ger',
    title: 'France vs Germany',
    league: 'Nations League',
    startTime: now + 3 * 60 * 60 * 1000, // upcoming -> NOT live
    isLive: false,
    markets: [
      {
        id: 'mk-fra-ger-winner',
        question: 'Match winner',
        outcomes: [
          outcome('France', 'tok-fra', 0.47),
          outcome('Draw', 'tok-draw-3', 0.27),
          outcome('Germany', 'tok-ger', 0.26),
        ],
      },
    ],
  },
];

// The user backed Portugal at 11% (now 19% -> profit) plus two more on live matches.
export const MOCK_BETS: Bet[] = [
  {
    id: 'bet-por',
    matchId: 'm-por-esp',
    marketId: 'mk-por-esp-winner',
    tokenId: 'tok-por',
    outcomeLabel: 'Portugal',
    countryCode: 'PT',
    entryPrice: 0.11,
    shares: 120,
    placedAt: now - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'bet-draw-por-esp',
    matchId: 'm-por-esp',
    marketId: 'mk-por-esp-winner',
    tokenId: 'tok-draw-1',
    outcomeLabel: 'Draw',
    entryPrice: 0.35,
    shares: 60,
    placedAt: now - 26 * 60 * 60 * 1000,
  },
  {
    id: 'bet-arg',
    matchId: 'm-bra-arg',
    marketId: 'mk-bra-arg-winner',
    tokenId: 'tok-arg',
    outcomeLabel: 'Argentina',
    countryCode: 'AR',
    entryPrice: 0.34,
    shares: 80,
    placedAt: now - 5 * 60 * 60 * 1000,
  },
];
