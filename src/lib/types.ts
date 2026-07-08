// Shared domain types for BetJet.

/** A single tradable outcome inside a market (e.g. "Portugal" in a match-winner market). */
export interface Outcome {
  /** Polymarket CLOB token id for this outcome. */
  tokenId: string;
  /** Human label, e.g. "Portugal", "Draw", "Yes". */
  label: string;
  /** ISO-3166 alpha-2 country code when the outcome maps to a nation, else undefined. */
  countryCode?: string;
  /** Current price in [0,1] — i.e. the implied probability / "odds". */
  price: number;
}

/** A Polymarket market attached to a sports match/event. */
export interface Market {
  /** Polymarket market id (condition id or market slug id). */
  id: string;
  /** Short question, e.g. "Portugal vs Spain — winner". */
  question: string;
  outcomes: Outcome[];
}

/** A sports event/match aggregating one or more markets. */
export interface Match {
  id: string;
  /** Display label, e.g. "Portugal vs Spain". */
  title: string;
  /** League/tag, e.g. "Euro 2028", "EPL". */
  league?: string;
  /** Scheduled kickoff (ms epoch). */
  startTime: number;
  /** True when the match is judged to be in-play right now. */
  isLive: boolean;
  markets: Market[];
}

/** A bet the user has placed (a position on one outcome). */
export interface Bet {
  /** Local id. */
  id: string;
  matchId: string;
  marketId: string;
  tokenId: string;
  /** Outcome label at bet time, e.g. "Portugal". */
  outcomeLabel: string;
  countryCode?: string;
  /** Price the user entered at, in [0,1]. */
  entryPrice: number;
  /** Number of shares held. */
  shares: number;
  /** ms epoch when placed. */
  placedAt: number;
}

/**
 * A prediction row shown in the widget. It joins a live outcome with the
 * user's position (if any) and computes PnL.
 */
export interface Prediction {
  matchId: string;
  matchTitle: string;
  league?: string;
  marketId: string;
  tokenId: string;
  outcomeLabel: string;
  countryCode?: string;
  /** Current odds in [0,1]. */
  currentPrice: number;
  /** The user's entry price in [0,1], or null when this is a discover-only row. */
  entryPrice: number | null;
  /** Shares held, or 0 for discover rows. */
  shares: number;
  /** True when this reflects a bet the user actually placed. */
  isUserBet: boolean;
  /** Realizable PnL in USDC (currentPrice - entryPrice) * shares, or null. */
  pnl: number | null;
  /** PnL as a fraction of cost basis, or null. */
  pnlPct: number | null;
}

export interface WidgetSnapshot {
  /** Predictions to render, already filtered to live matches. */
  predictions: Prediction[];
  /** True when at least one prediction is a live user bet (vs discover mode). */
  hasLiveBets: boolean;
  /** Aggregate PnL across live user bets, or null when none. */
  totalPnl: number | null;
  /** Data provenance for debugging / the UI badge. */
  source: 'live' | 'mock';
  /** ms epoch of when this snapshot was produced. */
  updatedAt: number;
}
