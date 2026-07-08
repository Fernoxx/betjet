import { useEffect, useState } from 'react';
import { wallet } from '../lib/wallet';
import { WIDGET_CSS } from '../content/styles';

// A minimal popup: connect the (demo/Privy) wallet and explain the widget.
export function Popup() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setAddress(wallet.getAddress());
  }, []);

  async function connect() {
    const addr = await wallet.connect();
    setAddress(addr);
  }

  return (
    <div style={{ width: 300, padding: 16, fontFamily: 'system-ui, sans-serif', background: '#15171c', color: '#e5e7eb' }}>
      <style>{WIDGET_CSS}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span className="bj-pill-dot" />
        <strong style={{ fontSize: 15 }}>BetJet</strong>
      </div>
      <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, marginTop: 0 }}>
        The floating widget appears bottom-right on every page. It shows your Polymarket bets on
        matches that are <strong>live right now</strong> — flag, current odds and PnL — and lets you
        buy/sell with one swipe.
      </p>

      <div style={{ marginTop: 14 }}>
        {address ? (
          <div style={{ fontSize: 12 }}>
            <div style={{ color: '#9ca3af', marginBottom: 4 }}>Wallet</div>
            <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{address}</code>
          </div>
        ) : (
          <button className="bj-btn bj-btn-buy" style={{ width: '100%' }} onClick={connect}>
            Connect wallet
          </button>
        )}
      </div>

      <p style={{ fontSize: 10, color: '#6b7280', marginTop: 16, marginBottom: 0 }}>
        Demo build · trading is mocked. Configure Privy + CLOB to place real bets.
      </p>
    </div>
  );
}
