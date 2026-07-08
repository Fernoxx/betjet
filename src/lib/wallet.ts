// Wallet abstraction.
//
// The widget depends only on this interface, so the backing implementation can be
// a Privy embedded wallet (recommended), an injected/WalletConnect EOA, or the
// demo stub below. A Privy implementation would:
//   1. init the Privy client with your app id,
//   2. create/recover an embedded wallet for the user,
//   3. expose the wallet address (for reading positions),
//   4. sign EIP-712 CLOB orders in trade.ts.

export interface Wallet {
  /** Whether a wallet is connected/available. */
  isConnected(): boolean;
  /** Polygon address of the signer, or null when disconnected. */
  getAddress(): string | null;
  /** Connect (create/recover). Resolves to the address. */
  connect(): Promise<string>;
  /** Sign an EIP-712 typed payload (used by trade.ts for CLOB orders). */
  signTypedData(payload: unknown): Promise<string>;
}

const ADDR_KEY = 'betjet:walletAddress';

/**
 * Demo wallet: persists a deterministic placeholder address so position lookups
 * and the "connected" state work end-to-end without funds. Swap for Privy in prod.
 */
export const demoWallet: Wallet = {
  isConnected() {
    return Boolean(localStorage.getItem(ADDR_KEY));
  },
  getAddress() {
    return localStorage.getItem(ADDR_KEY);
  },
  async connect() {
    // A stable, obviously-fake checksum-shaped address for the demo.
    const addr = '0xBe7Je700000000000000000000000000000dEm0';
    localStorage.setItem(ADDR_KEY, addr);
    return addr;
  },
  async signTypedData() {
    throw new Error('demoWallet cannot sign — configure a Privy/injected wallet to place real bets');
  },
};

export const wallet: Wallet = demoWallet;
