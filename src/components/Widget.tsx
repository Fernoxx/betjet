import { useCallback, useEffect, useRef, useState } from 'react';
import type { WidgetSnapshot } from '../lib/types';
import { computeSnapshot } from '../lib/data';
import { CollapsedPill } from './CollapsedPill';
import { SwipeDeck } from './SwipeDeck';

const POLL_MS = 20_000;

function useSnapshot() {
  const [snapshot, setSnapshot] = useState<WidgetSnapshot | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const snap = await computeSnapshot(ctrl.signal);
      if (!ctrl.signal.aborted) setSnapshot(snap);
    } catch {
      /* keep last snapshot */
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, POLL_MS);
    return () => {
      clearInterval(t);
      abortRef.current?.abort();
    };
  }, [refresh]);

  return { snapshot, refresh };
}

export function Widget() {
  const { snapshot, refresh } = useSnapshot();
  const [open, setOpen] = useState(false);

  if (!snapshot) return null; // nothing to show until first load

  return (
    <div className={`bj-root${open ? ' bj-open' : ''}`}>
      {open && (
        <div className="bj-panel" role="dialog" aria-label="Live bets">
          <div className="bj-panel-head">
            <div className="bj-panel-title">
              {snapshot.hasLiveBets ? 'Your live bets' : 'Live markets'}
              <span className="bj-live-badge">
                <span className="bj-pill-dot" /> LIVE
              </span>
            </div>
            <div className="bj-panel-tools">
              {snapshot.source === 'mock' && <span className="bj-demo-tag">demo</span>}
              <button className="bj-icon-btn" onClick={refresh} aria-label="Refresh" title="Refresh">
                ↻
              </button>
              <button className="bj-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          {snapshot.predictions.length === 0 ? (
            <div className="bj-empty">No live matches right now.</div>
          ) : (
            <SwipeDeck predictions={snapshot.predictions} onTraded={refresh} />
          )}

          <div className="bj-panel-foot">
            Swipe for more · odds from Polymarket
          </div>
        </div>
      )}

      <CollapsedPill snapshot={snapshot} onClick={() => setOpen((v) => !v)} />
    </div>
  );
}
