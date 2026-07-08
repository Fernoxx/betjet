// Tiny async key-value store on chrome.storage.local (extension-wide), with an
// in-memory fallback for non-extension contexts (plain-tab dev, tests).
// Content scripts must NOT use localStorage for extension state — it is scoped
// to the host page's origin, so state would differ per website.

const hasChrome = typeof chrome !== 'undefined' && !!chrome.storage?.local;

const memory = new Map<string, unknown>();

export async function kvGet<T>(key: string): Promise<T | null> {
  if (hasChrome) {
    const res = await chrome.storage.local.get(key);
    return (res[key] as T) ?? null;
  }
  return (memory.get(key) as T) ?? null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  if (hasChrome) {
    await chrome.storage.local.set({ [key]: value });
  } else {
    memory.set(key, value);
  }
}
