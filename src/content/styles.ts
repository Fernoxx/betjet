// All widget CSS, injected into the content-script shadow root so it never
// collides with or inherits from the host page.

export const WIDGET_CSS = `
:host, .bj-root, .bj-root * { box-sizing: border-box; }

.bj-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

/* ---------- collapsed pill ---------- */
.bj-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 999px;
  background: linear-gradient(180deg, #23262e 0%, #191b21 100%);
  box-shadow: 0 6px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset;
  cursor: pointer;
  color: #e5e7eb;
  font-size: 13px;
  line-height: 1;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.bj-pill:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(0,0,0,0.55); border-color: rgba(255,255,255,0.14); }
.bj-pill:active { transform: translateY(0); }

.bj-pill-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 0 0 rgba(34,197,94,0.6);
  animation: bj-pulse 1.8s infinite;
}
@keyframes bj-pulse {
  0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); }
  70% { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
}

.bj-pill-odds { font-weight: 600; color: #f3f4f6; }
.bj-pill-pnl { font-weight: 700; font-variant-numeric: tabular-nums; }
.bj-pill-count {
  font-size: 11px; color: #9ca3af;
  background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 999px;
}
.bj-pill-total {
  font-weight: 700; font-variant-numeric: tabular-nums;
  padding-left: 8px; margin-left: 2px; border-left: 1px solid rgba(255,255,255,0.08);
}
.bj-pill-live { font-weight: 700; letter-spacing: .06em; color: #22c55e; font-size: 11px; }
.bj-flag { display: inline-flex; }
.bj-monogram {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; color: #fff; font-weight: 700;
}

/* ---------- expanded panel ---------- */
.bj-panel {
  width: 360px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(180deg, #1c1f26 0%, #15171c 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  overflow: hidden;
  animation: bj-rise .18s ease both;
}
@keyframes bj-rise {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.bj-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 10px;
}
.bj-panel-title { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; color: #f3f4f6; }
.bj-live-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: .06em; color: #22c55e;
  background: rgba(34,197,94,0.12); padding: 3px 7px; border-radius: 999px;
}
.bj-panel-tools { display: flex; align-items: center; gap: 6px; }
.bj-demo-tag {
  font-size: 10px; color: #fbbf24; background: rgba(251,191,36,0.12);
  padding: 3px 7px; border-radius: 999px; font-weight: 700; letter-spacing: .04em;
}
.bj-icon-btn {
  width: 26px; height: 26px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  color: #cbd5e1; cursor: pointer; font-size: 13px; line-height: 1;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background .15s ease;
}
.bj-icon-btn:hover { background: rgba(255,255,255,0.1); }

/* ---------- deck ---------- */
.bj-deck { padding: 4px 0 8px; }
.bj-deck-scroller {
  display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.bj-deck-scroller::-webkit-scrollbar { display: none; }
.bj-deck-page {
  min-width: 100%; scroll-snap-align: start;
  display: flex; flex-direction: column; gap: 8px; padding: 0 16px;
}

.bj-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 12px;
}
.bj-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.bj-card-meta { min-width: 0; }
.bj-card-title { font-size: 13px; font-weight: 600; color: #e5e7eb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bj-card-league { font-size: 11px; color: #9ca3af; }
.bj-card-odds-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; }
.bj-card-odds { font-size: 22px; font-weight: 800; color: #f9fafb; font-variant-numeric: tabular-nums; line-height: 1; }
.bj-card-sub { font-size: 11px; color: #9ca3af; margin-top: 3px; }
.bj-card-pnl { text-align: right; }
.bj-card-pnl-usd { font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; line-height: 1; }
.bj-card-open .bj-card-pnl-usd { color: #9ca3af; font-weight: 700; }

.bj-card-actions { display: flex; gap: 8px; }
.bj-btn {
  flex: 1; padding: 9px 0; border-radius: 10px; border: 1px solid transparent;
  font-weight: 700; font-size: 13px; cursor: pointer; transition: filter .15s ease, opacity .15s ease;
}
.bj-btn:disabled { opacity: .45; cursor: not-allowed; }
.bj-btn-buy { background: #16a34a; color: #fff; }
.bj-btn-buy:hover:not(:disabled) { filter: brightness(1.08); }
.bj-btn-sell { background: rgba(239,68,68,0.14); color: #f87171; border-color: rgba(239,68,68,0.3); }
.bj-btn-sell:hover:not(:disabled) { filter: brightness(1.1); }

.bj-card-status { min-height: 14px; margin-top: 8px; font-size: 11px; color: #9ca3af; text-align: center; }
.bj-card-status[data-ok="true"] { color: #22c55e; }
.bj-card-status[data-ok="false"] { color: #ef4444; }

/* ---------- deck nav ---------- */
.bj-deck-nav { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 8px; }
.bj-deck-arrow {
  width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04); color: #cbd5e1; cursor: pointer; font-size: 16px; line-height: 1;
}
.bj-deck-arrow:disabled { opacity: .3; cursor: default; }
.bj-deck-dots { display: flex; gap: 6px; }
.bj-dot { width: 6px; height: 6px; border-radius: 50%; border: none; background: rgba(255,255,255,0.2); cursor: pointer; padding: 0; }
.bj-dot-active { background: #22c55e; width: 18px; border-radius: 999px; transition: width .2s ease; }

.bj-panel-foot { padding: 8px 16px 12px; font-size: 10px; color: #6b7280; text-align: center; }
.bj-empty { padding: 28px 16px; text-align: center; color: #9ca3af; font-size: 13px; }
`;
