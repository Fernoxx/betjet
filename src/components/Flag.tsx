import { flagEmoji, monogramColor } from '../lib/flags';

interface Props {
  label: string;
  countryCode?: string;
  size?: number;
}

/**
 * Renders a country flag emoji when we can resolve one (no text, per spec),
 * otherwise a colored monogram circle as a graceful fallback for clubs/draws.
 */
export function Flag({ label, countryCode, size = 28 }: Props) {
  if (countryCode) {
    return (
      <span
        className="bj-flag"
        style={{ fontSize: size, lineHeight: 1 }}
        title={label}
        aria-label={label}
        role="img"
      >
        {flagEmoji(countryCode)}
      </span>
    );
  }
  const initials = label.slice(0, 2).toUpperCase();
  return (
    <span
      className="bj-monogram"
      style={{
        width: size,
        height: size,
        background: monogramColor(label),
        fontSize: size * 0.42,
      }}
      title={label}
      aria-label={label}
    >
      {initials}
    </span>
  );
}
