'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import type { Vessel } from '@/types';

// Real 3D viewer is loaded only when the inspect modal opens. Cards never
// mount a Canvas — see comment block below.
const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

interface Props {
  vessel: Vessel;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

// Cards render a static pre-rendered thumbnail instead of a live <Canvas>.
// Mounting one Canvas per card was the single biggest perf killer — each
// Canvas creates its own WebGL context, render loop, OrbitControls, and
// (previously) HDR Environment. With 4-5 cards visible per game step plus
// up to 11 in the gallery, the browser hit its WebGL context limit and
// the page froze the machine. The full 3D viewer is gated behind an
// explicit Inspect button (or, in Collection.tsx, the card click itself),
// so at most one Canvas is alive at any time.
export default function VesselCard({
  vessel,
  onClick,
  selected,
  disabled,
}: Props) {
  const unavailable = vessel.available === false;
  // Derive thumb URL from model_asset, not vessel.id — multiple vessel ids
  // (e.g. `jue` + `jue_warm`) can share the same GLB, and the thumbnail is
  // named after the GLB filename.
  const thumb = vessel.model_asset.replace('/models/', '/thumbs/').replace(/\.glb$/, '.webp');
  const [inspecting, setInspecting] = useState(false);

  useEffect(() => {
    if (!inspecting) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setInspecting(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspecting]);

  const cardDisabled = disabled || unavailable;

  return (
    <>
      <div
        className={`
          group relative flex flex-col items-stretch
          rounded-xl p-4 sm:p-5 transition-all duration-200
          bg-gradient-to-b from-[#13131f]/95 to-[#0a0a14]/95
          border border-bronze/40
          w-[230px] sm:w-[290px] md:w-[320px]
          min-h-[400px] sm:min-h-[470px] md:min-h-[510px]
          shadow-[0_8px_24px_rgba(0,0,0,0.5)]
          ${selected ? 'border-gold shadow-[0_0_24px_rgba(243,201,105,0.45)]' : 'hover:border-bronze-light hover:shadow-[0_22px_40px_-12px_rgba(243,201,105,0.55)]'}
          ${cardDisabled ? 'opacity-40' : ''}
        `}
      >
        {!cardDisabled && (
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
            style={{ background: 'radial-gradient(closest-side, rgba(243,201,105,0.85), rgba(243,201,105,0) 75%)' }}
          />
        )}
        <div
          role={unavailable ? undefined : 'button'}
          tabIndex={unavailable ? -1 : 0}
          aria-label={unavailable ? undefined : `Inspect ${vessel.name_english} 3D model`}
          onClick={() => { if (!unavailable) setInspecting(true); }}
          onKeyDown={(e) => {
            if (unavailable) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setInspecting(true); }
          }}
          className={`relative h-48 sm:h-56 md:h-64 w-full rounded-lg bg-black/50 mb-4 overflow-hidden flex items-center justify-center
            ${unavailable ? 'cursor-not-allowed' : 'cursor-zoom-in'}`}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(184,115,51,0.2)' }}
        >
          {!unavailable ? (
            <>
              <img
                src={thumb}
                alt={vessel.name_english}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                draggable={false}
                style={{ filter: 'brightness(1.35) contrast(1.05) saturate(1.1)' }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 px-3 py-2 flex items-center justify-end gap-1.5
                           text-bronze-light/80 text-xs uppercase tracking-[0.2em]
                           opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }}
              >
                <span className="text-base">🔍</span>
                <span>Inspect</span>
              </div>
            </>
          ) : (
            <div className="text-bronze-light/50 text-xs italic">
              3D model unavailable
            </div>
          )}
        </div>
        <div className="w-full text-center px-1">
          <div className="text-3xl sm:text-4xl text-bronze-light font-serif leading-tight">
            {vessel.name_chinese}
          </div>
          <div
            className="text-[11px] sm:text-xs text-bronze-light/60 italic uppercase mt-1"
            style={{
              fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.2em',
              textIndent: '0.2em',
            }}
          >
            {vessel.name_pinyin}
          </div>
          <div className="text-xl sm:text-2xl text-foreground/80 mt-2">
            {vessel.name_english}
          </div>
        </div>
        <button
          type="button"
          disabled={cardDisabled}
          onClick={() => { if (!cardDisabled) onClick?.(); }}
          className={`mt-auto pt-4 sm:pt-5 group/btn`}
        >
          <span
            className={`block w-full text-center px-4 py-2.5 rounded-md
              text-sm sm:text-base uppercase tracking-[0.25em] transition-all duration-200
              ${cardDisabled
                ? 'bg-transparent border border-bronze/20 text-bronze-light/30 cursor-not-allowed'
                : selected
                  ? 'bg-gold/90 text-ink border border-gold cursor-pointer'
                  : 'bg-bronze/15 border border-bronze/60 text-bronze-light hover:bg-bronze/35 hover:border-gold hover:text-gold cursor-pointer'}`}
            style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}
          >
            {selected ? 'Selected' : 'Select'}
          </span>
        </button>
      </div>

      {inspecting && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)' }}
          onClick={() => setInspecting(false)}
        >
          <div
            className="relative rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #14141f 0%, #0a0a14 100%)',
              border: '1px solid rgba(184,115,51,0.45)',
              boxShadow:
                '0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(243,201,105,0.08), 0 0 60px rgba(243,201,105,0.08) inset',
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(184,115,51,0.25)' }}
            >
              <div className="flex items-baseline gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl text-bronze-light font-serif leading-none">
                  {vessel.name_chinese}
                </div>
                <div
                  className="text-xs sm:text-sm text-bronze-light/60 italic uppercase"
                  style={{
                    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                    letterSpacing: '0.25em',
                  }}
                >
                  {vessel.name_pinyin}
                </div>
                <div className="text-xl sm:text-2xl text-foreground/80">
                  {vessel.name_english}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspecting(false)}
                aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-bronze-light/70 hover:text-gold hover:bg-bronze/15 transition text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div
              className="relative w-full"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 35%, rgba(243,201,105,0.07) 0%, transparent 60%), #07070d',
                height: 'min(72vh, 720px)',
              }}
            >
              <ModelViewer url={vessel.model_asset} />
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-base sm:text-lg text-bronze-light/80"
              style={{
                borderTop: '1px solid rgba(184,115,51,0.2)',
                fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              <span className="flex items-center gap-3">
                <kbd className="px-3 py-1 rounded border border-bronze/40 text-base text-bronze-light bg-bronze/10">
                  Middle
                </kbd>
                drag to rotate
              </span>
              <span className="flex items-center gap-3">
                <kbd className="px-3 py-1 rounded border border-bronze/40 text-base text-bronze-light bg-bronze/10">
                  Scroll
                </kbd>
                to zoom
              </span>
              <span className="flex items-center gap-3">
                <kbd className="px-3 py-1 rounded border border-bronze/40 text-base text-bronze-light bg-bronze/10">
                  Esc
                </kbd>
                to close
              </span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
