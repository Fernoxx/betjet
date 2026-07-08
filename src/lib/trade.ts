// Trading interface (buy/sell an outcome on Polymarket).
//
// A bet on Polymarket is a signed EIP-712 order posted to the CLOB
// (https://clob.polymarket.com). Real order flow requires:
//   - a wallet with USDC on Polygon,
//   - allowances set for the CTF Exchange contract,
//   - building + signing the order (the @polymarket/clob-client SDK does this),
//   - POSTing it to /order.
//
// The MVP keeps that behind `Trader` and ships a mock implementation so the whole
// swipe/buy/sell UX is exercisable without funds. Replace `trader` with a real
// CLOB-backed implementation to go live.

import type { Wallet } from './wallet';
import { wallet } from './wallet';

export type Side = 'BUY' | 'SELL';

export interface OrderRequest {
  tokenId: string;
  side: Side;
  /** Limit price in [0,1]. */
  price: number;
  /** Number of shares. */
  size: number;
}

export interface OrderResult {
  ok: boolean;
  /** Order id / tx hash when real; a synthetic id in mock mode. */
  id: string;
  message: string;
  mock: boolean;
}

export interface Trader {
  placeOrder(req: OrderRequest): Promise<OrderResult>;
}

/** Mock trader: validates the request, pretends to fill, returns a synthetic id. */
export function createMockTrader(_wallet: Wallet = wallet): Trader {
  return {
    async placeOrder(req) {
      if (req.price <= 0 || req.price >= 1) {
        return { ok: false, id: '', message: 'price must be between 0 and 1', mock: true };
      }
      if (req.size <= 0) {
        return { ok: false, id: '', message: 'size must be positive', mock: true };
      }
      await new Promise((r) => setTimeout(r, 450)); // simulate network
      const id = `mock-${req.side}-${req.tokenId.slice(0, 6)}-${Date.now()}`;
      return {
        ok: true,
        id,
        message: `Mock ${req.side} ${req.size} @ ${(req.price * 100).toFixed(0)}%`,
        mock: true,
      };
    },
  };
}

export const trader: Trader = createMockTrader();
