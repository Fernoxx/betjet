// $BETJET token gate.
//
// The widget's tools unlock only while the user's Solana (Privy) wallet holds at
// least MIN_USD worth of the $BETJET pump.fun token, priced live:
//   balance : Solana RPC getTokenAccountsByOwner (sum of uiAmount across accounts)
//   price   : DexScreener token endpoint, falling back to Jupiter's price API —
//             both cover pump.fun tokens once they trade (bonding curve -> Raydium/PumpSwap)
//
// Set TOKEN.mint to the real pump.fun mint address before shipping. While the
// mint is a placeholder (or the demo wallet is active) the gate runs in demo
// mode: a simulated on-device balance that the Buy button tops up, so the whole
// lock -> buy -> unlock flow is demoable without funds.

import { wallet, isDemoAddress } from './wallet';
import { kvGet, kvSet } from './kv';

export const TOKEN = {
  /** TODO: replace with the real $BETJET pump.fun mint address. */
  mint: 'BETJETxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  symbol: 'BETJET',
  /** Minimum USD value of holdings required to unlock the tools. */
  minUsd: 1,
} as const;

export const PUMP_FUN_URL = `https://pump.fun/coin/${TOKEN.mint}`;

const SOL_RPC = 'https://api.mainnet-beta.solana.com';
const DEMO_USD_KEY = 'betjet:demoTokenUsd';
const DEMO_PRICE_USD = 0.000042; // synthetic $BETJET price for demo mode

export interface GateStatus {
  /** True when holdings >= TOKEN.minUsd — the tools are unlocked. */
  holds: boolean;
  /** USD value of the user's $BETJET. */
  usdValue: number;
  /** Token balance (ui amount). */
  tokenBalance: number;
  /** Live price in USD, or null when unavailable. */
  priceUsd: number | null;
  /** True when this status came from demo mode, not the chain. */
  demo: boolean;
}

function isPlaceholderMint(): boolean {
  return TOKEN.mint.startsWith('BETJETx');
}

async function fetchTokenBalance(owner: string, signal?: AbortSignal): Promise<number> {
  const res = await fetch(SOL_RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [owner, { mint: TOKEN.mint }, { encoding: 'jsonParsed' }],
    }),
  });
  if (!res.ok) throw new Error(`solana rpc ${res.status}`);
  const json = await res.json();
  const accounts: unknown[] = json?.result?.value ?? [];
  let total = 0;
  for (const a of accounts) {
    const amt = (a as { account?: { data?: { parsed?: { info?: { tokenAmount?: { uiAmount?: number } } } } } })
      ?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
    total += Number(amt ?? 0);
  }
  return total;
}

async function fetchPriceUsd(signal?: AbortSignal): Promise<number | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN.mint}`, { signal });
    if (res.ok) {
      const json = await res.json();
      const price = Number(json?.pairs?.[0]?.priceUsd);
      if (Number.isFinite(price) && price > 0) return price;
    }
  } catch {
    /* fall through to Jupiter */
  }
  try {
    const res = await fetch(`https://lite-api.jup.ag/price/v2?ids=${TOKEN.mint}`, { signal });
    if (res.ok) {
      const json = await res.json();
      const price = Number(json?.data?.[TOKEN.mint]?.price);
      if (Number.isFinite(price) && price > 0) return price;
    }
  } catch {
    /* no price available */
  }
  return null;
}

async function demoGate(): Promise<GateStatus> {
  const usdValue = (await kvGet<number>(DEMO_USD_KEY)) ?? 0;
  return {
    holds: usdValue >= TOKEN.minUsd,
    usdValue,
    tokenBalance: usdValue / DEMO_PRICE_USD,
    priceUsd: DEMO_PRICE_USD,
    demo: true,
  };
}

/** Simulate buying $BETJET in demo mode (the Buy button's demo path). */
export async function demoBuy(usd = 1.5): Promise<void> {
  const cur = (await kvGet<number>(DEMO_USD_KEY)) ?? 0;
  await kvSet(DEMO_USD_KEY, cur + usd);
}

export function isDemoGateActive(solAddress: string | null): boolean {
  return isPlaceholderMint() || !solAddress || isDemoAddress(solAddress);
}

/** Check whether the user currently holds >= $1 of $BETJET. */
export async function checkGate(signal?: AbortSignal): Promise<GateStatus> {
  const owner = await wallet.getSolanaAddress();
  if (isDemoGateActive(owner)) return demoGate();

  try {
    const [tokenBalance, priceUsd] = await Promise.all([
      fetchTokenBalance(owner!, signal),
      fetchPriceUsd(signal),
    ]);
    if (priceUsd === null) {
      // No live price -> can't value holdings; stay locked rather than guessing,
      // but report the balance so the UI can explain.
      return { holds: false, usdValue: 0, tokenBalance, priceUsd: null, demo: false };
    }
    const usdValue = tokenBalance * priceUsd;
    return { holds: usdValue >= TOKEN.minUsd, usdValue, tokenBalance, priceUsd, demo: false };
  } catch {
    // Chain/price lookup failed entirely — fall back to demo so the widget
    // still demos instead of hard-locking on network hiccups.
    return demoGate();
  }
}
