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
        flex flex-col items-start text-left p-6 rounded-lg
        bg-[#0d0d1a]/80 backdrop-blur-sm bronze-border
        transition-all duration-200 max-w-sm
        ${selected ? 'bronze-glow scale-[1.02]' : 'hover:bronze-glow hover:scale-[1.02]'}
      `}
    >
      <div className="text-2xl text-bronze-light mb-3">
        {occasion.name_english}
      </div>
      <div className="text-sm text-foreground/80 italic mb-4">
        “{occasion.flavor}”
      </div>
      <div className="text-xs text-bronze-light/60 mt-auto">
        {occasion.us_equivalent}
      </div>
    </button>
  );
}
