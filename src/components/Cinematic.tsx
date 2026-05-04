'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { vesselById } from '@/data/vessels';

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

interface Props {
  storage: string;
  warming: string;
  drinking: string;
  storageCorrect: boolean;
  warmingCorrect: boolean;
  drinkingCorrect: boolean;
  beiTriggered: boolean;
  onComplete: () => void;
}

const ACT_DURATION = 5000;

export default function Cinematic({
  storage,
  warming,
  drinking,
  storageCorrect,
  warmingCorrect,
  drinkingCorrect,
  beiTriggered,
  onComplete,
}: Props) {
  const [act, setAct] = useState(0);

  useEffect(() => {
    if (act >= 3) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setAct((a) => a + 1), ACT_DURATION);
    return () => clearTimeout(t);
  }, [act, onComplete]);

  const acts = [
    { vesselId: storage, label: 'The Pour', correct: storageCorrect },
    { vesselId: warming, label: 'The Warm', correct: warmingCorrect },
    {
      vesselId: drinking,
      label: 'The Drink',
      correct: drinkingCorrect,
    },
  ];

  const current = acts[Math.min(act, 2)];
  const vessel = vesselById(current.vesselId);

  return (
    <div className="fixed inset-0 z-50 bronze-gradient flex flex-col items-center justify-center">
      {beiTriggered && act === 2 && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="text-7xl font-bold text-red-500 animate-pulse drop-shadow-lg">
            WRONG ERA
          </div>
          <div className="absolute inset-0 bg-red-900/20 animate-pulse" />
        </div>
      )}

      <div className="text-bronze-light/60 uppercase tracking-[0.4em] text-sm mb-4">
        Act {Math.min(act + 1, 3)} — {current.label}
      </div>

      <div
        key={act}
        className={`relative w-[420px] h-[420px] ink-fade ${current.correct ? '' : 'shake'}`}
      >
        {vessel && vessel.available !== false ? (
          <ModelViewer url={vessel.model_asset} interactive={false} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bronze-light/40">
            (model unavailable)
          </div>
        )}

        {current.correct && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gold"
                style={{
                  left: `${50 + 30 * Math.cos((i / 16) * Math.PI * 2)}%`,
                  top: `${50 + 30 * Math.sin((i / 16) * Math.PI * 2)}%`,
                  background: '#f3c969',
                  boxShadow: '0 0 12px #f3c969',
                  animation: `bubble ${1.5 + Math.random()}s ease-out infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {vessel && (
        <div className="mt-6 text-center">
          <div className="text-3xl text-bronze-light">
            {vessel.name_chinese}{' '}
            <span className="text-base italic text-bronze-light/60">
              {vessel.name_pinyin}
            </span>
          </div>
          <div className="text-sm text-foreground/70">
            {vessel.name_english}
          </div>
        </div>
      )}
    </div>
  );
}
