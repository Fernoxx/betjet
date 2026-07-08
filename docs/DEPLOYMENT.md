# Deploying BetJet

**TL;DR — the extension does NOT go to Vercel.** A Chrome extension ships through the
**Chrome Web Store**. Vercel (or any host) is only needed if you add an optional companion
backend/website. Both paths are below.

---

## 1. The extension → Chrome Web Store

### One-time setup
1. Create a [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole)
   with your Google account and pay the **one-time $5 registration fee**.

### Every release
1. **Set real config** before building:
   - `src/lib/tokengate.ts` → real `$BETJET` pump.fun **mint address**
   - `src/lib/wallet.ts` / `src/lib/trade.ts` → Privy app id + real CLOB trader (when going live)
2. **Build and zip:**
   ```bash
   npm run build
   cd dist && zip -r ../betjet-v0.1.0.zip . && cd ..
   ```
3. **Upload** the zip in the [developer console](https://chrome.google.com/webstore/devconsole)
   → "New item".
4. **Store listing:** name, description, category (Productivity or Fun), screenshots
   (1280×800), small promo tile (440×280), icon (128×128 — add one to `manifest.config.ts`
   via the `icons` key before shipping).
5. **Privacy tab — this is what reviews get stuck on:**
   - Justify each permission: `storage` (cache bets/odds), `alarms` (background refresh),
     and every `host_permission` (Polymarket odds, Solana RPC + DexScreener/Jupiter for the
     $BETJET gate).
   - The `<all_urls>` content script (floating widget on every page) gets extra scrutiny —
     explain it clearly, or consider narrowing matches / making the widget opt-in per site
     to speed up review.
   - Declare a privacy policy URL (a one-pager on your website/Vercel is fine).
6. Submit for review. First review typically takes **1–7 days**; gambling-adjacent apps can
   get a closer look. BetJet is an *interface to Polymarket*, not a book — say that
   explicitly in the listing. Check the store's gambling policy for your target countries;
   you may need to restrict regions in the listing.
7. **Updates:** bump `version` in `manifest.config.ts`, rebuild, upload the new zip. Users
   auto-update within hours.

### Other stores (same zip, minor tweaks)
- **Edge Add-ons** (free) and **Firefox AMO** (needs a `browser_specific_settings` key and
  MV3 event-page tweaks) are optional extra reach.

### Private/beta distribution (before store approval)
- Share the `dist/` folder (or zip) and load via `chrome://extensions` → Developer mode →
  **Load unpacked**. Good for your token community beta.

---

## 2. Optional companion services → Vercel (or any host)

None of these are required for the MVP, but you'll likely want some for production:

| Service | Why | Where |
| --- | --- | --- |
| Landing page + privacy policy | Store listing requirement, marketing, $BETJET link | Vercel (static) |
| Price/odds proxy API | Hide RPC keys (paid Solana RPC), cache Polymarket/DexScreener responses, rate-limit protection | Vercel serverless / edge functions |
| Privy backend verification | Verify Privy auth tokens server-side if you add accounts/referrals | Vercel functions |
| Sports scores service | True in-play detection (API-Football etc. — keys must NOT live in the extension) | Vercel functions + cron |
| Agent backend | The "sports-betting agent" brain (alerts, auto cash-out rules, AI picks) — long-running logic doesn't belong in an MV3 service worker, which Chrome kills after ~30s idle | Vercel cron/functions, or a small VPS/Cloudflare Workers |

Rule of thumb: **anything with a secret key or that must run while the browser is closed
goes to the backend; everything else stays in the extension.**

---

## 3. Going-live checklist

- [ ] Real `$BETJET` mint in `tokengate.ts` (+ verify DexScreener/Jupiter return its price)
- [ ] Privy app id; implement `Wallet` (EVM + Solana embedded wallets)
- [ ] Real `Trader` via `@polymarket/clob-client` (USDC allowances + signed orders)
- [ ] Icons in manifest, store screenshots, privacy policy URL
- [ ] Consider a paid Solana RPC (public mainnet RPC rate-limits hard) behind your proxy
- [ ] Region/compliance review for prediction-market access (Polymarket itself geo-blocks
      some jurisdictions, including the US without their CFTC-regulated arm)
