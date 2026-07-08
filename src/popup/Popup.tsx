import { useCallback, useEffect, useState } from 'react';
import { wallet } from '../lib/wallet';
import type { GateStatus } from '../lib/tokengate';
import { checkGate, TOKEN } from '../lib/tokengate';
import { WIDGET_CSS } from '../content/styles';

// A minimal popup: connect the (demo/Privy) wallet, show gate status.
export function Popup() {
  const [evm, setEvm] = useState<string | null>(null);
  const [sol, setSol] = useState<string | null>(null);
  const [gate, setGate] = useState<GateStatus | null>(null);

  const load = useCallback(async () => {
    setEvm(await wallet.getAddress());
    setSol(await wallet.getSolanaAddress());
    setGate(await checkGate());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function connect() {
    await wallet.connect();
    await load();
  }

  return (
    <div style={{ width: 300, padding: 16, fontFamily: 'system-ui, sans-serif', background: '#12141b', color: '#eef0f4' }}>
      <style>{WIDGET_CSS}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span className="bj-pill-dot" />
        <strong style={{ fontSize: 15 }}>BetJet</strong>
        {gate && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: gate.holds ? '#34d399' : '#f87171' }}>
            {gate.holds ? 'unlocked' : 'locked'}
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: '#9aa2af', lineHeight: 1.5, marginTop: 0 }}>
        The floating widget appears bottom-right on every page. It shows your Polymarket bets on
        matches that are <strong>live right now</strong> — flag, current odds and PnL — and lets you
        buy/sell with one swipe. Hold at least ${TOKEN.minUsd} of ${TOKEN.symbol} to unlock.
      </p>

      <div style={{ marginTop: 14 }}>
        {evm ? (
          <div style={{ fontSize: 12, display: 'grid', gap: 8 }}>
            <div>
              <div style={{ color: '#9aa2af', marginBottom: 3 }}>Polygon (bets)</div>
              <code style={{ fontSize: 10.5, wordBreak: 'break-all' }}>{evm}</code>
            </div>
            <div>
              <div style={{ color: '#9aa2af', marginBottom: 3 }}>Solana (${TOKEN.symbol})</div>
              <code style={{ fontSize: 10.5, wordBreak: 'break-all' }}>{sol}</code>
            </div>
            {gate && (
              <div style={{ color: '#9aa2af' }}>
                ${TOKEN.symbol} holdings: <strong style={{ color: '#eef0f4' }}>${gate.usdValue.toFixed(2)}</strong>
              </div>
            )}
          </div>
        ) : (
          <button className="bj-btn bj-btn-buy" style={{ width: '100%' }} onClick={connect}>
            Connect wallet
          </button>
        )}
      </div>

      <p style={{ fontSize: 10, color: '#6f7683', marginTop: 16, marginBottom: 0 }}>
        Demo build · trading is mocked. Configure Privy + CLOB to place real bets.
      </p>
    </div>
  );
}
