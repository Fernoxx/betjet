import { useCallback, useEffect, useRef, useState } from 'react';
import type { WidgetSnapshot } from '../lib/types';
import type { GateStatus } from '../lib/tokengate';
import { checkGate } from '../lib/tokengate';
import { computeSnapshot } from '../lib/data';
import { CollapsedPill } from './CollapsedPill';
import { SwipeDeck } from './SwipeDeck';
import { LockedPill, GatePanel } from './Gate';

const POLL_MS = 20_000;
const GATE_POLL_MS = 60_000;

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

function useGate() {
  const [gate, setGate] = useState<GateStatus | null>(null);

  const recheck = useCallback(async () => {
    try {
      setGate(await checkGate());
    } catch {
      /* keep last status */
    }
  }, []);

  useEffect(() => {
    recheck();
    const t = setInterval(recheck, GATE_POLL_MS);
    return () => clearInterval(t);
  }, [recheck]);

  return { gate, recheck };
}

export function Widget() {
  const { snapshot, refresh } = useSnapshot();
  const { gate, recheck } = useGate();
  const [open, setOpen] = useState(false);

  if (!snapshot || !gate) return null; // nothing until first load

  const locked = !gate.holds;

  return (
    <div className={`bj-root${open ? ' bj-open' : ''}`}>
      {open && (
        <div className="bj-panel" role="dialog" aria-label={locked ? 'Unlock BetJet' : 'Live bets'}>
          <div className="bj-panel-head">
            <div className="bj-panel-title">
              {locked ? 'BetJet' : snapshot.hasLiveBets ? 'Your live bets' : 'Live markets'}
              {!locked && (
                <span className="bj-live-badge">
                  <span className="bj-pill-dot" /> LIVE
                </span>
              )}
            </div>
            <div className="bj-panel-tools">
              {(snapshot.source === 'mock' || gate.demo) && <span className="bj-demo-tag">demo</span>}
              {!locked && (
                <button className="bj-icon-btn" onClick={refresh} aria-label="Refresh" title="Refresh">
                  ↻
                </button>
              )}
              <button className="bj-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          {locked ? (
            <GatePanel status={gate} onRecheck={recheck} />
          ) : snapshot.predictions.length === 0 ? (
            <div className="bj-empty">No live matches right now.</div>
          ) : (
            <SwipeDeck predictions={snapshot.predictions} onTraded={refresh} />
          )}

          <div className="bj-panel-foot">
            {locked ? 'powered by $BETJET' : 'Swipe for more · odds from Polymarket'}
          </div>
        </div>
      )}

      {locked ? (
        <LockedPill onClick={() => setOpen((v) => !v)} />
      ) : (
        <CollapsedPill snapshot={snapshot} onClick={() => setOpen((v) => !v)} />
      )}
    </div>
  );
}
