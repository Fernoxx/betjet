// Live-match detection.
//
// The MVP uses a start-time heuristic: a match is "live" from kickoff until a
// sport-specific duration later. This needs no extra API key. To upgrade to true
// in-play status, implement `LiveSource` against a scores API (ESPN/API-Football)
// and swap the default export — the rest of the app only depends on the interface.

import type { Match } from './types';

export interface LiveSource {
  /** Return the input matches with `isLive` decided. */
  annotate(matches: Match[], now?: number): Match[];
}

// Rough in-play windows (ms) including stoppage/halftime/overtime slack.
const DEFAULT_WINDOW_MS = 2.5 * 60 * 60 * 1000; // 2h30 covers most soccer/basketball

export const startTimeLiveSource: LiveSource = {
  annotate(matches, now = Date.now()) {
    return matches.map((m) => {
      const started = now >= m.startTime;
      const withinWindow = now <= m.startTime + DEFAULT_WINDOW_MS;
      return { ...m, isLive: started && withinWindow };
    });
  },
};

/** The active source. Replace with a scores-API-backed source for real in-play data. */
export const liveSource: LiveSource = startTimeLiveSource;

export function liveMatches(matches: Match[], now = Date.now()): Match[] {
  return liveSource.annotate(matches, now).filter((m) => m.isLive);
}
