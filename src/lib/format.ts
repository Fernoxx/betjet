// Formatting helpers for odds, PnL and colors.

/** Price in [0,1] -> "11%" style odds string. */
export function oddsPct(price: number): string {
  return `${Math.round(price * 100)}%`;
}

/** Signed percentage, e.g. +12.3% / -4.0%. Null-safe. */
export function signedPct(pct: number | null): string {
  if (pct === null || Number.isNaN(pct)) return '—';
  const v = pct * 100;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
}

/** Signed USDC amount, e.g. +$12.30 / -$4.00. Null-safe. */
export function signedUsd(amount: number | null): string {
  if (amount === null || Number.isNaN(amount)) return '—';
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}

export type PnlTone = 'up' | 'down' | 'flat';

export function pnlTone(pnl: number | null): PnlTone {
  if (pnl === null || Math.abs(pnl) < 1e-9) return 'flat';
  return pnl > 0 ? 'up' : 'down';
}

export const TONE_COLOR: Record<PnlTone, string> = {
  up: '#22c55e', // green — profit
  down: '#ef4444', // red — loss
  flat: '#9ca3af', // gray — neutral
};
