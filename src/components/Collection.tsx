'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { vessels } from '@/data/vessels';
import { useGameStore } from '@/store/gameStore';
import type { Vessel } from '@/types';

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

export default function Collection() {
  const discovered = useGameStore((s) => s.discovered);
  const [selected, setSelected] = useState<Vessel | null>(null);

  const total = vessels.length;
  const found = vessels.filter((v) => discovered.includes(v.id)).length;

  return (
    <div className="px-8 py-8">
      <div className="text-center text-bronze-light mb-2 uppercase tracking-widest text-sm">
        Vessel Collection
      </div>
      <div className="text-center text-foreground/70 mb-8">
        {found} / {total} vessels discovered
      </div>

      <div className="grid grid-cols-5 gap-4 max-w-5xl mx-auto">
        {vessels.map((v) => {
          const isFound = discovered.includes(v.id);
          const showThumb = isFound && v.available !== false;
          return (
            <button
              key={v.id}
              onClick={() => isFound && setSelected(v)}
              className={`bronze-border rounded-lg p-3 bg-[#0d0d1a]/80 transition-all
                ${isFound ? 'hover:bronze-glow cursor-pointer' : 'opacity-40 cursor-default'}`}
            >
              <div className="h-32 flex items-center justify-center">
                {showThumb ? (
                  // Static thumbnail — see VesselCard.tsx for rationale on
                  // why we don't mount a <Canvas> per card. Thumb URL is
                  // derived from model_asset since multiple ids may share a GLB.
                  <img
                    src={v.model_asset.replace('/models/', '/thumbs/').replace(/\.glb$/, '.webp')}
                    alt={v.name_english}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="text-3xl text-bronze-light/30">???</div>
                )}
              </div>
              <div className="text-center text-bronze-light mt-2">
                {isFound ? v.name_chinese : '???'}
              </div>
              <div className="text-center text-xs text-foreground/60 italic">
                {isFound ? v.name_pinyin : '—'}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="bronze-border rounded-lg p-6 bg-[#0d0d1a] max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-6">
              <div className="w-64 h-64 flex-shrink-0 bg-black/40 rounded">
                {selected.available !== false && (
                  <ModelViewer url={selected.model_asset} />
                )}
              </div>
              <div className="flex-1">
                <div className="text-4xl text-bronze-light">
                  {selected.name_chinese}{' '}
                  <span className="text-base italic text-bronze-light/60">
                    {selected.name_pinyin}
                  </span>
                </div>
                <div className="text-foreground/80 mb-3">
                  {selected.name_english}
                </div>
                <div className="text-sm text-foreground/80 italic mb-3">
                  {selected.short_description}
                </div>
                <div className="text-xs text-bronze-light/70 border-t border-bronze/30 pt-2">
                  {selected.historical_fact}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 px-4 py-2 bronze-border rounded text-bronze-light"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
