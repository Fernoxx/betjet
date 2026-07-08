import type { WidgetSnapshot } from '../lib/types';
import { Flag } from './Flag';
import { oddsPct, signedPct, signedUsd, pnlTone, TONE_COLOR } from '../lib/format';

interface Props {
  snapshot: WidgetSnapshot;
  onClick: () => void;
}

/**
 * The collapsed floating pill (like the Rabby perp widget). When the user has a
 * live bet: flag (no text) + current odds + PnL%. Otherwise a compact "live
 * markets" prompt.
 */
export function CollapsedPill({ snapshot, onClick }: Props) {
  const lead = snapshot.predictions[0];

  if (snapshot.hasLiveBets && lead) {
    const tone = pnlTone(snapshot.totalPnl);
    const color = TONE_COLOR[tone];
    const extra = snapshot.predictions.length - 1;
    return (
      <button className="bj-pill" onClick={onClick} aria-label="Open your live bets">
        <span className="bj-pill-dot" />
        <Flag label={lead.outcomeLabel} countryCode={lead.countryCode} size={17} />
        <span className="bj-pill-odds">{oddsPct(lead.currentPrice)}</span>
        <span className="bj-pill-pnl" style={{ color }}>
          {signedPct(lead.pnlPct)}
        </span>
        {extra > 0 && <span className="bj-pill-count">+{extra}</span>}
        <span className="bj-pill-total" style={{ color }}>
          {signedUsd(snapshot.totalPnl)}
        </span>
      </button>
    );
  }

  // Discover mode: no live bets, invite the user into currently-live markets.
  const count = new Set(snapshot.predictions.map((p) => p.matchId)).size;
  return (
    <button className="bj-pill bj-pill-discover" onClick={onClick} aria-label="Browse live markets">
      <span className="bj-pill-dot" />
      <span className="bj-pill-live">LIVE</span>
      <span className="bj-pill-odds">
        {count} {count === 1 ? 'match' : 'matches'}
      </span>
    </button>
  );
}
