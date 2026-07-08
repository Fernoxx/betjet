// Background service worker: periodically refresh the snapshot and cache it, so
// the content-script widget can render instantly on page load and stays warm.

import { computeSnapshot, cacheSnapshot } from '../lib/data';

const ALARM = 'betjet:refresh';
const PERIOD_MIN = 1; // minimum granularity for chrome.alarms

async function refresh() {
  try {
    const snap = await computeSnapshot();
    await cacheSnapshot(snap);
  } catch {
    /* leave the last cached snapshot in place */
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: PERIOD_MIN });
  refresh();
});

chrome.runtime.onStartup?.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: PERIOD_MIN });
  refresh();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) refresh();
});
