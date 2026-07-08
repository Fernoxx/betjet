import { useRef, useState, useEffect } from 'react';
import type { Prediction } from '../lib/types';
import { PredictionCard } from './PredictionCard';

interface Props {
  predictions: Prediction[];
  onTraded?: () => void;
}

/**
 * Horizontal, scroll-snapped deck. ~3 cards are visible per "page"; the user
 * swipes (touch / trackpad) or uses the dots/arrows to page through more.
 */
export function SwipeDeck({ predictions, onTraded }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.max(1, Math.ceil(predictions.length / perPage));

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = Math.round(el.scrollLeft / el.clientWidth);
      setPage(p);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  function goto(p: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="bj-deck">
      <div className="bj-deck-scroller" ref={scrollerRef}>
        {Array.from({ length: pages }).map((_, pi) => (
          <div className="bj-deck-page" key={pi}>
            {predictions.slice(pi * perPage, pi * perPage + perPage).map((p) => (
              <PredictionCard key={p.tokenId} prediction={p} onTraded={onTraded} />
            ))}
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="bj-deck-nav">
          <button
            className="bj-deck-arrow"
            onClick={() => goto(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="bj-deck-dots">
            {Array.from({ length: pages }).map((_, pi) => (
              <button
                key={pi}
                className={`bj-dot${pi === page ? ' bj-dot-active' : ''}`}
                onClick={() => goto(pi)}
                aria-label={`Page ${pi + 1}`}
              />
            ))}
          </div>
          <button
            className="bj-deck-arrow"
            onClick={() => goto(Math.min(pages - 1, page + 1))}
            disabled={page === pages - 1}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
