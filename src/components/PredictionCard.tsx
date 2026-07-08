import { useState } from 'react';
import type { Prediction } from '../lib/types';
import { Flag } from './Flag';
import { oddsPct, signedPct, signedUsd, pnlTone, TONE_COLOR } from '../lib/format';
import { trader } from '../lib/trade';

interface Props {
  prediction: Prediction;
  /** Notify parent to refresh after a trade (so PnL/positions update). */
  onTraded?: () => void;
}

type Status = { kind: 'idle' } | { kind: 'pending' } | { kind: 'done'; msg: string; ok: boolean };

const DEFAULT_SIZE = 10; // shares per one-tap bet

export function PredictionCard({ prediction: p, onTraded }: Props) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const tone = pnlTone(p.pnl);
  const color = TONE_COLOR[tone];

  async function trade(side: 'BUY' | 'SELL') {
    if (status.kind === 'pending') return;
    setStatus({ kind: 'pending' });
    const res = await trader.placeOrder({
      tokenId: p.tokenId,
      side,
      price: p.currentPrice,
      size: DEFAULT_SIZE,
    });
    setStatus({ kind: 'done', msg: res.message, ok: res.ok });
    if (res.ok) onTraded?.();
    setTimeout(() => setStatus({ kind: 'idle' }), 2200);
  }

  return (
    <div className="bj-card">
      <div className="bj-card-head">
        <Flag label={p.outcomeLabel} countryCode={p.countryCode} size={30} />
        <div className="bj-card-meta">
          <div className="bj-card-title">{p.matchTitle}</div>
          {p.league && <div className="bj-card-league">{p.league}</div>}
        </div>
      </div>

      <div className="bj-card-odds-row">
        <div>
          <div className="bj-card-odds">{oddsPct(p.currentPrice)}</div>
          <div className="bj-card-sub">odds</div>
        </div>
        {p.isUserBet ? (
          <div className="bj-card-pnl" style={{ color }}>
            <div className="bj-card-pnl-usd">{signedUsd(p.pnl)}</div>
            <div className="bj-card-sub">
              {signedPct(p.pnlPct)} · in @ {oddsPct(p.entryPrice ?? 0)}
            </div>
          </div>
        ) : (
          <div className="bj-card-pnl bj-card-open">
            <div className="bj-card-pnl-usd">Open</div>
            <div className="bj-card-sub">no position</div>
          </div>
        )}
      </div>

      <div className="bj-card-actions">
        <button
          className="bj-btn bj-btn-buy"
          disabled={status.kind === 'pending'}
          onClick={() => trade('BUY')}
        >
          Buy
        </button>
        <button
          className="bj-btn bj-btn-sell"
          disabled={status.kind === 'pending' || !p.isUserBet}
          onClick={() => trade('SELL')}
        >
          Sell
        </button>
      </div>

      <div className="bj-card-status" data-ok={status.kind === 'done' ? status.ok : undefined}>
        {status.kind === 'pending' && 'Placing…'}
        {status.kind === 'done' && status.msg}
      </div>
    </div>
  );
}
