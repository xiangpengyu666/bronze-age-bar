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

  const currentActIndex = Math.min(act, 2);
  const cleanPinyin = vessel
    ? vessel.name_pinyin.normalize('NFD').replace(/[̀-ͯ]/g, '')
    : '';

  return (
    <div className="fixed inset-0 z-50 bronze-gradient flex flex-col items-center justify-center overflow-hidden py-10">
      {beiTriggered && act === 2 && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="text-7xl font-bold text-red-500 animate-pulse drop-shadow-lg">
            WRONG ERA
          </div>
          <div className="absolute inset-0 bg-red-900/20 animate-pulse" />
        </div>
      )}

      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="text-bronze-light/45 uppercase tracking-[0.5em] text-xs">
          Act {currentActIndex + 1} of 3
        </div>
        <div
          className="text-3xl tracking-[0.3em] uppercase"
          style={{
            color: '#f3c969',
            textShadow: '0 0 24px rgba(243,201,105,0.45)',
          }}
        >
          {current.label}
        </div>
        <div className="flex gap-3 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-[3px] rounded-full transition-all duration-500"
              style={{
                width: i === currentActIndex ? 56 : 24,
                background:
                  i < currentActIndex
                    ? '#f3c96988'
                    : i === currentActIndex
                      ? '#f3c969'
                      : 'rgba(243,201,105,0.18)',
              }}
            />
          ))}
        </div>
      </div>

      <div
        key={act}
        className={`relative w-[min(56vh,520px)] h-[min(56vh,520px)] ink-fade ${current.correct ? '' : 'shake'}`}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 55%, rgba(243,201,105,0.10) 0%, rgba(243,201,105,0) 55%)',
          }}
        />
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
        <div className="mt-4 flex flex-col items-center">
          <div className="text-7xl text-bronze-light leading-none">
            {vessel.name_chinese}
          </div>
          <div
            className="h-px w-24 my-3"
            style={{
              background:
                'linear-gradient(90deg, transparent, #f3c96966, transparent)',
            }}
          />
          <div
            className="text-4xl italic tracking-[0.18em] lowercase"
            style={{
              color: '#f3c969',
              textShadow: '0 0 18px rgba(243,201,105,0.35)',
            }}
          >
            {cleanPinyin}
          </div>
        </div>
      )}
    </div>
  );
}
