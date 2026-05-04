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
        role="button"
        tabIndex={cardDisabled ? -1 : 0}
        aria-disabled={cardDisabled}
        onClick={() => { if (!cardDisabled) onClick?.(); }}
        onKeyDown={(e) => {
          if (cardDisabled) return;
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
        }}
        className={`
          relative flex flex-col items-stretch text-left
          rounded-lg p-3 transition-all duration-200
          bg-[#0d0d1a]/80
          bronze-border
          ${selected ? 'bronze-glow scale-[1.03]' : ''}
          ${cardDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bronze-glow hover:scale-[1.02] cursor-pointer'}
        `}
        style={{ width: 220, minHeight: 320 }}
      >
        <div className="relative h-44 w-full rounded bg-black/40 mb-3 overflow-hidden flex items-center justify-center">
          {!unavailable ? (
            <>
              <img
                src={thumb}
                alt={vessel.name_english}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
                draggable={false}
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setInspecting(true); }}
                aria-label={`Inspect ${vessel.name_english} 3D model`}
                title="Inspect in 3D"
                className="absolute top-1.5 right-1.5 px-2 py-1 rounded
                           bg-black/55 hover:bg-black/75
                           text-bronze-light text-[11px] tracking-wide
                           border border-bronze/40 hover:border-gold
                           transition"
              >
                🔍 Inspect
              </button>
            </>
          ) : (
            <div className="text-bronze-light/50 text-xs">
              (3D model unavailable)
            </div>
          )}
        </div>
        <div className="text-3xl text-bronze-light font-serif text-center">
          {vessel.name_chinese}
        </div>
        <div className="text-sm text-bronze-light/70 text-center italic">
          {vessel.name_pinyin}
        </div>
        <div className="text-base text-foreground text-center mt-1">
          {vessel.name_english}
        </div>
      </div>

      {inspecting && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-6"
          onClick={() => setInspecting(false)}
        >
          <div
            className="bronze-border rounded-lg bg-[#0d0d1a] p-4 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-3xl text-bronze-light font-serif">
                  {vessel.name_chinese}{' '}
                  <span className="text-base italic text-bronze-light/60">
                    {vessel.name_pinyin}
                  </span>
                </div>
                <div className="text-sm text-foreground/70">{vessel.name_english}</div>
              </div>
              <button
                type="button"
                onClick={() => setInspecting(false)}
                aria-label="Close"
                className="text-bronze-light/70 hover:text-bronze-light text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>
            <div className="w-full h-[460px] bg-black/40 rounded">
              <ModelViewer url={vessel.model_asset} />
            </div>
            <div className="text-[10px] text-bronze-light/60 text-center mt-2">
              Hold middle mouse to rotate · scroll to zoom · Esc to close
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
