'use client';

import type { Occasion } from '@/types';

interface Props {
  occasion: Occasion;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export default function OccasionCard({
  occasion,
  onClick,
  selected,
  compact,
}: Props) {
  if (compact) {
    return (
      <div className="bronze-border rounded-md px-4 py-2 bg-[#0d0d1a]/80 backdrop-blur-sm">
        <div className="text-xs text-bronze-light/70 uppercase tracking-widest">
          Occasion
        </div>
        <div className="text-bronze-light text-lg">
          {occasion.name_english}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-stretch text-left p-5 sm:p-8 rounded-lg
        bg-[#0d0d1a]/80 backdrop-blur-sm bronze-border
        transition-all duration-200 w-full sm:w-auto max-w-[460px] sm:w-[460px]
        ${selected ? 'bronze-glow scale-[1.02]' : 'hover:bronze-glow hover:scale-[1.02]'}
      `}
    >
      <div className="text-2xl sm:text-3xl text-bronze-light mb-3 sm:mb-4">
        {occasion.name_english}
      </div>
      <div className="text-sm sm:text-base text-foreground/80 italic mb-4 sm:mb-5">
        “{occasion.flavor}”
      </div>
      <div className="text-xs sm:text-sm text-bronze-light/60 mb-4 sm:mb-5">
        {occasion.us_equivalent}
      </div>
      <div className="relative mt-auto rounded overflow-hidden border border-bronze/40 aspect-[3/2] bg-black/40">
        <img
          src={`/images/occasions/${occasion.id}.jpg`}
          alt={occasion.us_equivalent}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          draggable={false}
          style={{ filter: 'sepia(0.25) saturate(0.9) brightness(0.92)' }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(13,13,26,0) 60%, rgba(13,13,26,0.55) 100%)',
          }}
        />
      </div>
    </button>
  );
}
