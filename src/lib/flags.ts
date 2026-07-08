// Map an outcome label (usually a national team) to an ISO-3166 alpha-2 code,
// and turn that code into a flag emoji. Clubs / non-country outcomes fall back
// to a colored monogram rendered by the <Flag/> component.

const NAME_TO_ISO: Record<string, string> = {
  portugal: 'PT',
  spain: 'ES',
  france: 'FR',
  germany: 'DE',
  england: 'GB',
  brazil: 'BR',
  argentina: 'AR',
  italy: 'IT',
  netherlands: 'NL',
  belgium: 'BE',
  croatia: 'HR',
  'united states': 'US',
  usa: 'US',
  mexico: 'MX',
  japan: 'JP',
  'south korea': 'KR',
  morocco: 'MA',
  senegal: 'SN',
  nigeria: 'NG',
  ghana: 'GH',
  uruguay: 'UY',
  colombia: 'CO',
  poland: 'PL',
  switzerland: 'CH',
  denmark: 'DK',
  sweden: 'SE',
  norway: 'NO',
  austria: 'AT',
  turkey: 'TR',
  ukraine: 'UA',
  serbia: 'RS',
  'czech republic': 'CZ',
  czechia: 'CZ',
  scotland: 'GB',
  wales: 'GB',
  ireland: 'IE',
  canada: 'CA',
  australia: 'AU',
  egypt: 'EG',
  saudi_arabia: 'SA',
  'saudi arabia': 'SA',
  qatar: 'QA',
  iran: 'IR',
  cameroon: 'CM',
  ecuador: 'EC',
  peru: 'PE',
  chile: 'CL',
};

/** Resolve a country code from an outcome label. Returns undefined for non-nations. */
export function countryCodeForLabel(label: string): string | undefined {
  const key = label.trim().toLowerCase();
  return NAME_TO_ISO[key];
}

/** Convert an ISO-3166 alpha-2 code (e.g. "PT") into a flag emoji (🇵🇹). */
export function flagEmoji(code: string): string {
  const cc = code.trim().toUpperCase();
  if (cc.length !== 2) return '';
  const A = 0x1f1e6;
  const base = 'A'.charCodeAt(0);
  return String.fromCodePoint(A + (cc.charCodeAt(0) - base), A + (cc.charCodeAt(1) - base));
}

/** Deterministic accent color for a monogram fallback, derived from the label. */
export function monogramColor(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) % 360;
  return `hsl(${h} 55% 45%)`;
}
