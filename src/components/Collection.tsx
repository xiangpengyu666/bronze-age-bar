'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { vessels } from '@/data/vessels';
import { useGameStore } from '@/store/gameStore';
import type { Vessel } from '@/types';

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

const CATEGORY_LABEL: Record<Vessel['category'], string> = {
  storage: 'Storage',
  warming: 'Warming',
  drinking: 'Drinking',
};

export default function Collection() {
  const discovered = useGameStore((s) => s.discovered);
  const [selected, setSelected] = useState<Vessel | null>(null);

  const total = vessels.length;
  const found = vessels.filter((v) => discovered.includes(v.id)).length;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const grouped: Record<Vessel['category'], Vessel[]> = {
    storage: vessels.filter((v) => v.category === 'storage'),
    warming: vessels.filter((v) => v.category === 'warming'),
    drinking: vessels.filter((v) => v.category === 'drinking'),
  };

  return (
    <div className="px-6 sm:px-12 py-10 max-w-[1400px] mx-auto">
      <header className="flex flex-col items-center text-center mb-10">
        <div className="text-bronze-light uppercase tracking-[0.45em] text-sm">
          Vessel Collection
        </div>
        <h1
          className="text-5xl mt-3 leading-none"
          style={{
            color: '#f3c969',
            textShadow: '0 0 28px rgba(243,201,105,0.4)',
          }}
        >
          {found} <span className="text-bronze-light/60">/ {total}</span>
        </h1>
        <div
          className="h-px w-40 my-4"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(243,201,105,0.6), transparent)',
          }}
        />
        <div className="text-foreground/85 italic text-base">
          Bronze vessels of the Zhou ritual.
        </div>
      </header>

      {(Object.keys(grouped) as Vessel['category'][]).map((cat) => (
        <section key={cat} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="text-bronze-light text-sm uppercase tracking-[0.4em]">
              {CATEGORY_LABEL[cat]}
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-bronze/50 via-bronze/20 to-transparent" />
            <div className="text-foreground/60 text-xs">
              {grouped[cat].filter((v) => discovered.includes(v.id)).length} /{' '}
              {grouped[cat].length}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {grouped[cat].map((v) => {
              const isFound = discovered.includes(v.id);
              const showThumb = isFound && v.available !== false;
              const cleanPinyin = v.name_pinyin
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '');
              return (
                <button
                  key={v.id}
                  onClick={() => isFound && setSelected(v)}
                  disabled={!isFound}
                  className={`group relative rounded-xl px-4 py-5 transition-all duration-200
                    bg-gradient-to-b from-[#13131f]/95 to-[#0a0a14]/95
                    border flex flex-col items-center
                    ${
                      isFound
                        ? 'border-bronze/50 cursor-zoom-in hover:border-gold hover:shadow-[0_18px_36px_-12px_rgba(243,201,105,0.45)]'
                        : 'border-bronze/15 opacity-50 cursor-not-allowed'
                    }`}
                >
                  <div
                    className="w-full h-32 sm:h-36 flex items-center justify-center rounded-md mb-3 overflow-hidden"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 60%, rgba(243,201,105,0.10), rgba(0,0,0,0.4) 70%)',
                    }}
                  >
                    {showThumb ? (
                      <img
                        src={v.model_asset
                          .replace('/models/', '/thumbs/')
                          .replace(/\.glb$/, '.webp')}
                        alt={v.name_english}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.06]"
                        draggable={false}
                        style={{
                          filter:
                            'brightness(1.35) contrast(1.05) saturate(1.1)',
                        }}
                      />
                    ) : (
                      <div className="text-4xl text-bronze-light/25 tracking-widest">
                        ???
                      </div>
                    )}
                  </div>
                  <div className="text-3xl text-bronze-light leading-none">
                    {isFound ? v.name_chinese : '？'}
                  </div>
                  <div
                    className="text-lg italic mt-2 tracking-[0.15em]"
                    style={{ color: isFound ? '#f3c969' : '#5a5a82' }}
                  >
                    {isFound ? cleanPinyin : '—'}
                  </div>
                  {isFound && (
                    <div
                      aria-hidden
                      className="absolute bottom-2 right-3 text-xs uppercase tracking-widest text-bronze-light/0 group-hover:text-bronze-light/70 transition"
                    >
                      🔍 Inspect
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {selected &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)',
            }}
            onClick={() => setSelected(null)}
          >
            <div
              className="relative rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  'linear-gradient(180deg, #14141f 0%, #0a0a14 100%)',
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
                  <div className="text-4xl text-bronze-light leading-none">
                    {selected.name_chinese}
                  </div>
                  <div
                    className="text-xl italic tracking-[0.18em]"
                    style={{ color: '#f3c969' }}
                  >
                    {selected.name_pinyin
                      .normalize('NFD')
                      .replace(/[̀-ͯ]/g, '')}
                  </div>
                  <div className="text-lg text-foreground/80">
                    {selected.name_english}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
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
                  height: 'min(60vh, 600px)',
                }}
              >
                {selected.available !== false ? (
                  <ModelViewer url={selected.model_asset} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-bronze-light/40 italic">
                    3D model unavailable
                  </div>
                )}
              </div>

              <div
                className="px-8 py-5 flex flex-col gap-3"
                style={{ borderTop: '1px solid rgba(184,115,51,0.2)' }}
              >
                <div className="text-foreground italic leading-relaxed text-base">
                  {selected.short_description}
                </div>
                <div className="text-bronze-light/85 text-sm leading-relaxed border-t border-bronze/25 pt-3 italic">
                  {selected.historical_fact}
                </div>
              </div>

              <div
                className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 text-sm text-bronze-light/80"
                style={{
                  borderTop: '1px solid rgba(184,115,51,0.2)',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <span className="flex items-center gap-3">
                  <kbd className="px-3 py-1 rounded border border-bronze/40 text-bronze-light bg-bronze/10">
                    Middle
                  </kbd>
                  drag to rotate
                </span>
                <span className="flex items-center gap-3">
                  <kbd className="px-3 py-1 rounded border border-bronze/40 text-bronze-light bg-bronze/10">
                    Scroll
                  </kbd>
                  to zoom
                </span>
                <span className="flex items-center gap-3">
                  <kbd className="px-3 py-1 rounded border border-bronze/40 text-bronze-light bg-bronze/10">
                    Esc
                  </kbd>
                  to close
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
