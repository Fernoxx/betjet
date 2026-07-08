// All widget CSS, injected into the content-script shadow root so it never
// collides with or inherits from the host page.
//
// Design: small frosted-glass surfaces — translucent dark glass, heavy backdrop
// blur, hairline borders, soft depth, springy-but-subtle motion.

export const WIDGET_CSS = `
:host, .bj-root, .bj-root * { box-sizing: border-box; }

.bj-root {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #eef0f4;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  -webkit-font-smoothing: antialiased;
}

/* ---------- glass primitives ---------- */
.bj-pill, .bj-panel {
  background: rgba(18, 20, 27, 0.55);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
  backdrop-filter: blur(18px) saturate(1.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* ---------- collapsed pill (small) ---------- */
.bj-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  border-radius: 999px;
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  cursor: pointer;
  color: #eef0f4;
  font-size: 12px;
  line-height: 1;
  transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease, border-color .22s ease, background .22s ease;
}
.bj-pill:hover {
  transform: translateY(-1px) scale(1.03);
  border-color: rgba(255,255,255,0.2);
  background: rgba(24, 27, 35, 0.65);
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.1);
}
.bj-pill:active { transform: translateY(0) scale(.98); }

.bj-pill-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #34d399;
  animation: bj-pulse 2s cubic-bezier(.4,0,.6,1) infinite;
}
@keyframes bj-pulse {
  0% { box-shadow: 0 0 0 0 rgba(52,211,153,.5); }
  70% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
  100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
}

.bj-pill-odds { font-weight: 650; color: #f6f7f9; letter-spacing: .01em; }
.bj-pill-pnl { font-weight: 700; font-variant-numeric: tabular-nums; }
.bj-pill-count {
  font-size: 10px; color: #aab1bd;
  background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 999px;
}
.bj-pill-total {
  font-weight: 700; font-variant-numeric: tabular-nums;
  padding-left: 7px; margin-left: 1px; border-left: 1px solid rgba(255,255,255,0.12);
}
.bj-pill-live { font-weight: 700; letter-spacing: .07em; color: #34d399; font-size: 10px; }
.bj-pill-locked { opacity: .92; }
.bj-lock-ico { font-size: 12px; line-height: 1; filter: grayscale(.2); }
.bj-flag { display: inline-flex; filter: drop-shadow(0 1px 2px rgba(0,0,0,.35)); }
.bj-monogram {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; color: #fff; font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
}

/* ---------- expanded panel ---------- */
.bj-panel {
  width: 324px;
  max-width: calc(100vw - 36px);
  border-radius: 20px;
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.09);
  overflow: hidden;
  animation: bj-rise .26s cubic-bezier(.21,1.02,.55,1) both;
  transform-origin: bottom right;
}
@keyframes bj-rise {
  from { opacity: 0; transform: translateY(10px) scale(.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.bj-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px 8px;
}
.bj-panel-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; color: #f6f7f9; }
.bj-live-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9px; font-weight: 700; letter-spacing: .07em; color: #34d399;
  background: rgba(52,211,153,0.12); padding: 3px 7px; border-radius: 999px;
  border: 1px solid rgba(52,211,153,0.18);
}
.bj-panel-tools { display: flex; align-items: center; gap: 5px; }
.bj-demo-tag {
  font-size: 9px; color: #fbbf24; background: rgba(251,191,36,0.1);
  border: 1px solid rgba(251,191,36,0.2);
  padding: 3px 7px; border-radius: 999px; font-weight: 700; letter-spacing: .05em;
}
.bj-icon-btn {
  width: 24px; height: 24px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  color: #cdd3dc; cursor: pointer; font-size: 12px; line-height: 1;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .18s ease, transform .18s ease;
}
.bj-icon-btn:hover { background: rgba(255,255,255,0.12); transform: scale(1.06); }
.bj-icon-btn:active { transform: scale(.94); }

/* ---------- deck ---------- */
.bj-deck { padding: 2px 0 6px; }
.bj-deck-scroller {
  display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.bj-deck-scroller::-webkit-scrollbar { display: none; }
.bj-deck-page {
  min-width: 100%; scroll-snap-align: start;
  display: flex; flex-direction: column; gap: 7px; padding: 0 14px;
}

.bj-card {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 10px 11px;
  transition: background .18s ease, border-color .18s ease;
}
.bj-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.13); }
.bj-card-head { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
.bj-card-meta { min-width: 0; }
.bj-card-title { font-size: 12px; font-weight: 650; color: #eef0f4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bj-card-league { font-size: 10px; color: #9aa2af; margin-top: 1px; }
.bj-card-odds-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 8px; }
.bj-card-odds { font-size: 19px; font-weight: 800; color: #fbfcfe; font-variant-numeric: tabular-nums; line-height: 1; }
.bj-card-sub { font-size: 10px; color: #9aa2af; margin-top: 3px; }
.bj-card-pnl { text-align: right; }
.bj-card-pnl-usd { font-size: 14px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }
.bj-card-open .bj-card-pnl-usd { color: #9aa2af; font-weight: 700; }

.bj-card-actions { display: flex; gap: 7px; }
.bj-btn {
  flex: 1; padding: 8px 0; border-radius: 10px; border: 1px solid transparent;
  font-weight: 700; font-size: 12px; cursor: pointer;
  transition: filter .18s ease, opacity .18s ease, transform .18s ease;
}
.bj-btn:hover:not(:disabled) { transform: translateY(-1px); }
.bj-btn:active:not(:disabled) { transform: translateY(0) scale(.98); }
.bj-btn:disabled { opacity: .4; cursor: not-allowed; }
.bj-btn-buy {
  background: linear-gradient(180deg, #22c55e, #16a34a);
  color: #fff;
  box-shadow: 0 2px 10px rgba(34,197,94,.25), inset 0 1px 0 rgba(255,255,255,.2);
}
.bj-btn-buy:hover:not(:disabled) { filter: brightness(1.07); }
.bj-btn-sell {
  background: rgba(239,68,68,0.1); color: #f87171;
  border-color: rgba(239,68,68,0.28);
}
.bj-btn-sell:hover:not(:disabled) { background: rgba(239,68,68,0.16); }

.bj-card-status { min-height: 13px; margin-top: 6px; font-size: 10px; color: #9aa2af; text-align: center; }
.bj-card-status[data-ok="true"] { color: #34d399; }
.bj-card-status[data-ok="false"] { color: #f87171; }

/* ---------- deck nav ---------- */
.bj-deck-nav { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 7px; }
.bj-deck-arrow {
  width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05); color: #cdd3dc; cursor: pointer; font-size: 14px; line-height: 1;
  transition: background .18s ease;
}
.bj-deck-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.12); }
.bj-deck-arrow:disabled { opacity: .3; cursor: default; }
.bj-deck-dots { display: flex; gap: 5px; }
.bj-dot { width: 5px; height: 5px; border-radius: 50%; border: none; background: rgba(255,255,255,0.22); cursor: pointer; padding: 0; transition: width .22s ease, background .22s ease; }
.bj-dot-active { background: #34d399; width: 16px; border-radius: 999px; }

.bj-panel-foot { padding: 7px 14px 11px; font-size: 9px; color: #6f7683; text-align: center; letter-spacing: .02em; }
.bj-empty { padding: 26px 14px; text-align: center; color: #9aa2af; font-size: 12px; }

/* ---------- token gate ---------- */
.bj-gate { padding: 20px 18px 16px; text-align: center; }
.bj-gate-lock { font-size: 26px; margin-bottom: 8px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.4)); }
.bj-gate-title { font-size: 14px; font-weight: 750; color: #f6f7f9; }
.bj-gate-sub { font-size: 11px; color: #9aa2af; line-height: 1.5; margin: 6px 0 14px; }
.bj-gate-meter {
  height: 5px; border-radius: 999px; background: rgba(255,255,255,0.08);
  overflow: hidden; margin-bottom: 7px;
}
.bj-gate-meter-fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, #34d399, #22c55e);
  transition: width .4s cubic-bezier(.21,1.02,.55,1);
}
.bj-gate-holdings { font-size: 11px; color: #cdd3dc; margin-bottom: 14px; }
.bj-gate-holdings strong { color: #f6f7f9; }
.bj-gate-price { color: #8b93a1; }
.bj-gate-buy { width: 100%; padding: 10px 0; font-size: 13px; }
.bj-gate-hint { font-size: 9.5px; color: #8b93a1; margin-top: 7px; letter-spacing: .01em; }
.bj-gate-refresh {
  margin-top: 12px; background: none; border: none; cursor: pointer;
  font-size: 10.5px; color: #7dd3ae; text-decoration: underline; text-underline-offset: 2px;
}
.bj-gate-refresh:hover { color: #34d399; }

@media (prefers-reduced-motion: reduce) {
  .bj-pill, .bj-panel, .bj-btn, .bj-icon-btn, .bj-dot, .bj-gate-meter-fill { transition: none; animation: none; }
  .bj-pill-dot { animation: none; }
}
`;
