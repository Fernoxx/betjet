# BetJet 🎯

A Chrome extension (Manifest V3) with a **floating widget** — like the Rabby wallet
perp-trades widget — that surfaces your **Polymarket sports bets on matches that are
live right now**, and lets you **buy/sell odds with one swipe**.

<img alt="collapsed pill → expanded swipe deck" src="./docs/preview.svg" width="640" />

## What it does

- **Collapsed pill** (bottom-right, every page): if you have a bet on a live match it shows
  the country **flag (no text) + current odds + PnL%**, colored **green for profit, red for
  loss**, plus your aggregate PnL — exactly the Rabby-style compact readout.
- **Tap to expand**: a panel shows **all your predictions on the live match**. It’s a
  **swipe deck — ~3 predictions per page**, swipe (or dots/arrows) for more, and **Buy/Sell**
  on any of them.
- **Live-only**: nothing shows for upcoming or finished matches. A bet only appears once its
  match is judged **in-play**.
- **Discover fallback**: if **none** of your betted matches is live, the widget shows
  predictions from **currently-live markets** so you can place a bet.

## How the pieces map to your questions

> **"Polymarket public API + Privy wallet — yeah?"** → **Yes.**
> - Read odds/markets from the **Gamma API** (`gamma-api.polymarket.com`, no auth) — `src/lib/polymarket.ts`.
> - A bet is an **EIP-712 signed order** posted to the **CLOB** (`clob.polymarket.com`),
>   settled in **USDC on Polygon**. A **Privy embedded wallet** signs those orders.
>   The signing/posting is behind the `Trader` interface in `src/lib/trade.ts`.

> **"Or connect to their MAIN Polymarket wallet and bet from there?"** → **Basically no.**
> Polymarket funds live behind a **proxy/smart wallet** (Magic for email users, a Safe-style
> proxy for wallet users). There is **no OAuth "connect my Polymarket account"** — you can’t
> reach into someone’s existing Polymarket balance/positions and trade unless you control
> their signer. Practical options: **(a) a dedicated Privy embedded wallet** (recommended),
> or **(b) connect an external EOA** (MetaMask/WalletConnect). Both are behind the `Wallet`
> interface in `src/lib/wallet.ts`.

> **"Cross-check my bets and show only the ones whose match is live"** → `src/lib/snapshot.ts`
> joins your positions (`data-api.polymarket.com/positions?user=<addr>`) with live matches and
> computes PnL. **Live detection** is `src/lib/live.ts` (start-time heuristic today; swap in a
> scores API for true in-play).

## Architecture

```
manifest.config.ts        MV3 manifest (crxjs)
src/
  content/index.tsx       injects the widget into a Shadow DOM (no CSS bleed)
  content/styles.ts       all widget CSS
  background/index.ts      service worker: polls + caches the snapshot (chrome.alarms)
  popup/                   toolbar popup: connect wallet + explainer
  components/              Widget, CollapsedPill, SwipeDeck, PredictionCard, Flag
  lib/
    polymarket.ts          Gamma markets + data-API positions (read)
    live.ts                LiveSource interface + start-time heuristic
    snapshot.ts            cross-check bets × live matches → WidgetSnapshot
    data.ts                orchestrator with mock fallback + cache
    bets.ts                user bets store (chrome.storage.local)
    wallet.ts              Wallet interface + demo/Privy-ready stub
    trade.ts               Trader interface + mock CLOB order flow
    flags.ts, format.ts    country→flag, odds/PnL formatting
    mock.ts                demo matches + bets so the UI always renders
```

## Run it

```bash
npm install
npm run build          # type-checks + builds to dist/
# Chrome → chrome://extensions → Developer mode → "Load unpacked" → select dist/
npm run dev            # HMR dev build (crxjs)
```

Open any page: the widget appears bottom-right. With no network/wallet it renders **demo**
data (Portugal @ 11% → live at 19%, in profit) so you can see the full flow.

## What’s real vs. stubbed in this MVP

| Area | Status |
| --- | --- |
| Live odds / markets (Gamma) | **Real** API client, with mock fallback |
| Positions read (data API) | **Real** client (needs a wallet address) |
| Live detection | **Heuristic** (start-time); pluggable `LiveSource` for a scores API |
| Wallet | **Demo** stub behind `Wallet`; drop in Privy or injected EOA |
| Buy/Sell (CLOB orders) | **Mocked** behind `Trader`; full swipe/buy/sell UX works |

### Going live (to place real bets)
1. Implement `Wallet` with Privy (`@privy-io/react-auth`): create the embedded wallet, expose
   the address, sign EIP-712.
2. Implement `Trader` with `@polymarket/clob-client`: set USDC allowances, build + sign the
   order, POST to `/order`.
3. Optionally implement a scores-API-backed `LiveSource` for accurate in-play status.

The UI and data layer don’t change — only those three interfaces get real backings.
