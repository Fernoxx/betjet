// Wallet abstraction.
//
// The widget depends only on this interface, so the backing implementation can be
// a Privy embedded wallet (recommended), an injected/WalletConnect EOA, or the
// demo stub below. Privy embedded wallets can be created on BOTH chains we need:
//   - an EVM (Polygon) signer  -> signs EIP-712 CLOB orders, holds USDC
//   - a Solana wallet          -> holds the $BETJET pump.fun token for the gate
//
// A real implementation would init the Privy client with your app id, create or
// recover both embedded wallets, and expose their addresses + EIP-712 signing.

import { kvGet, kvSet } from './kv';

export interface Wallet {
  /** Polygon (EVM) address of the CLOB signer, or null when disconnected. */
  getAddress(): Promise<string | null>;
  /** Solana address holding $BETJET, or null when disconnected. */
  getSolanaAddress(): Promise<string | null>;
  /** Connect (create/recover). Resolves to both addresses. */
  connect(): Promise<{ evm: string; sol: string }>;
  /** Sign an EIP-712 typed payload (used by trade.ts for CLOB orders). */
  signTypedData(payload: unknown): Promise<string>;
}

const EVM_KEY = 'betjet:walletEvm';
const SOL_KEY = 'betjet:walletSol';

// Obviously-fake demo addresses; swap this whole object for a Privy adapter.
const DEMO_EVM = '0xBe7Je700000000000000000000000000000dEm0';
const DEMO_SOL = 'DemoSoLBetJet1111111111111111111111111111111';

/**
 * Demo wallet: persists placeholder addresses in chrome.storage so the
 * connected state and position/gate lookups work end-to-end without funds.
 */
export const demoWallet: Wallet = {
  getAddress: () => kvGet<string>(EVM_KEY),
  getSolanaAddress: () => kvGet<string>(SOL_KEY),
  async connect() {
    await kvSet(EVM_KEY, DEMO_EVM);
    await kvSet(SOL_KEY, DEMO_SOL);
    return { evm: DEMO_EVM, sol: DEMO_SOL };
  },
  async signTypedData() {
    throw new Error('demoWallet cannot sign — configure a Privy/injected wallet to place real bets');
  },
};

export const wallet: Wallet = demoWallet;

export function isDemoAddress(addr: string | null): boolean {
  return addr === DEMO_EVM || addr === DEMO_SOL;
}
