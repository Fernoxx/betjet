import { useState } from 'react';
import type { GateStatus } from '../lib/tokengate';
import { TOKEN, PUMP_FUN_URL, demoBuy } from '../lib/tokengate';

/** Collapsed pill shown while the tools are locked. */
export function LockedPill({ onClick }: { onClick: () => void }) {
  return (
    <button className="bj-pill bj-pill-locked" onClick={onClick} aria-label="Unlock BetJet tools">
      <span className="bj-lock-ico">🔒</span>
      <span className="bj-pill-odds">${TOKEN.symbol}</span>
    </button>
  );
}

interface PanelProps {
  status: GateStatus;
  /** Re-run the gate check (after a buy / manual refresh). */
  onRecheck: () => void;
}

/** Expanded panel content while locked: requirement, holdings, Buy button. */
export function GatePanel({ status, onRecheck }: PanelProps) {
  const [busy, setBusy] = useState(false);

  async function buy() {
    if (busy) return;
    setBusy(true);
    try {
      if (status.demo) {
        await demoBuy(); // simulate the purchase so the unlock flow is demoable
      } else {
        window.open(PUMP_FUN_URL, '_blank', 'noopener');
      }
      onRecheck();
    } finally {
      setBusy(false);
    }
  }

  const progress = Math.min(1, status.usdValue / TOKEN.minUsd);

  return (
    <div className="bj-gate">
      <div className="bj-gate-lock">🔒</div>
      <div className="bj-gate-title">Hold ${TOKEN.minUsd} of ${TOKEN.symbol} to unlock</div>
      <div className="bj-gate-sub">
        Live-bet widget, odds &amp; one-swipe trading unlock while your wallet holds at least $
        {TOKEN.minUsd} worth of ${TOKEN.symbol}.
      </div>

      <div className="bj-gate-meter" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
        <div className="bj-gate-meter-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="bj-gate-holdings">
        You hold <strong>${status.usdValue.toFixed(2)}</strong>
        {status.priceUsd !== null && (
          <span className="bj-gate-price">
            {' '}· {Math.round(status.tokenBalance).toLocaleString()} ${TOKEN.symbol} @ $
            {status.priceUsd.toPrecision(2)}
          </span>
        )}
        {status.priceUsd === null && <span className="bj-gate-price"> · price unavailable</span>}
      </div>

      <button className="bj-btn bj-btn-buy bj-gate-buy" onClick={buy} disabled={busy}>
        {busy ? 'Buying…' : `Buy $${TOKEN.symbol}`}
      </button>
      <div className="bj-gate-hint">
        buy and hold at least ${TOKEN.minUsd} worth ${TOKEN.symbol} to use the tools
      </div>

      <button className="bj-gate-refresh" onClick={onRecheck}>
        I already hold — re-check
      </button>
    </div>
  );
}
