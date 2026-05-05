'use client';

interface Props {
  fillPercent: number; // 0-100
  targetMin?: number;
  targetMax?: number;
  label?: string;
  variant?: 'player' | 'expected';
}

export default function WineMeter({
  fillPercent,
  targetMin = 35,
  targetMax = 75,
  label,
  variant = 'player',
}: Props) {
  const inTarget = fillPercent >= targetMin && fillPercent <= targetMax;
  const overflow = fillPercent > targetMax + 15;

  let liquidColor: string;
  if (variant === 'expected') {
    liquidColor = '#7fc8a9';
  } else {
    liquidColor = '#5a5a82';
    if (overflow) liquidColor = '#a32020';
    else if (inTarget) liquidColor = '#f3c969';
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <div
          className="text-xs uppercase tracking-widest"
          style={{ color: variant === 'expected' ? '#7fc8a9' : undefined }}
        >
          {label}
        </div>
      )}
      <div
        className="relative w-20 h-48 rounded-b-3xl rounded-t-md overflow-hidden bronze-border"
        style={{
          background: '#0d0d1a',
          boxShadow:
            variant === 'expected' ? '0 0 0 1px #7fc8a955 inset' : undefined,
        }}
      >
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700"
          style={{
            height: `${Math.min(fillPercent, 100)}%`,
            background: `linear-gradient(180deg, ${liquidColor}cc 0%, ${liquidColor} 100%)`,
            boxShadow: inTarget
              ? `0 0 22px ${liquidColor}aa inset`
              : 'none',
          }}
        >
          {/* Bubbles for underfill */}
          {!inTarget && !overflow && (
            <>
              <span
                className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/40"
                style={{ animation: 'bubble 2.2s ease-in infinite' }}
              />
              <span
                className="absolute bottom-1 left-6 w-1 h-1 rounded-full bg-white/30"
                style={{ animation: 'bubble 2.6s ease-in 0.4s infinite' }}
              />
            </>
          )}
        </div>

        {/* Target zone markers */}
        <div
          className="absolute left-0 right-0 border-t border-bronze/60 pointer-events-none"
          style={{ bottom: `${targetMin}%` }}
        />
        <div
          className="absolute left-0 right-0 border-t border-bronze/60 pointer-events-none"
          style={{ bottom: `${targetMax}%` }}
        />

        {/* Overflow drip */}
        {overflow && (
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full"
            style={{
              background: '#a32020',
              animation: 'drip 1.2s ease-in infinite',
            }}
          />
        )}
      </div>
      <div className="text-xs text-bronze-light/80">{fillPercent}%</div>
    </div>
  );
}
