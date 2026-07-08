import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'BetJet — live sports bets widget',
  version: '0.1.0',
  description:
    'Floating widget that shows your Polymarket bets on currently-live matches and lets you buy/sell odds with one swipe.',
  action: {
    default_popup: 'index.html',
    default_title: 'BetJet',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.tsx'],
      run_at: 'document_idle',
    },
  ],
  permissions: ['storage', 'alarms'],
  host_permissions: [
    'https://gamma-api.polymarket.com/*',
    'https://clob.polymarket.com/*',
    'https://data-api.polymarket.com/*',
  ],
});
