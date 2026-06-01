'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { vesselById } from '@/data/vessels';

const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false });

/**
 * Cinematic cutscene shown between the drinking-vessel pick and the result
 * screen. Two phases:
 *
 *   1. `acts` — the legacy three-act recap. For each slot (storage / warming
 *      / drinking) we show the player's pick rotating in 3D for 5 seconds
 *      with a gold particle ring on correct, a shake + the WRONG ERA overlay
 *      on incorrect (or specifically the "bei" anachronism on the 3rd act).
 *
 *   2. `video` — once all three acts have played, swap to a pre-rendered
 *      10-second ink-wash outcome video selected by tier (perfect / minor /
 *      disgrace / anachronism). Background music is ducked only during this
 *      phase so the soundtrack doesn't fight the cinematic audio.
 *
 * The (occasion × outcome) matrix is collapsed to outcome only — we ship four
 * canonical court-scene videos and play the same one regardless of which
 * occasion the player picked. Occasion-specific narrative lives in the Court
 * Records panel on the result screen.
 */

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

type Outcome = 'perfect' | 'minor_breach' | 'total_disgrace' | 'anachronism';

const VIDEO_BY_OUTCOME: Record<Outcome, string> = {
  perfect: '/cinematics/perfect.mp4',
  minor_breach: '/cinematics/minor_breach.mp4',
  total_disgrace: '/cinematics/total_disgrace.mp4',
  anachronism: '/cinematics/anachronism.mp4',
};

const ACT_DURATION = 5000;
// Source videos are 10s; allow a grace window before we force the transition
// in case `onended` never fires (some browsers drop the event when the tab
// loses focus mid-playback).
const VIDEO_SAFETY_MS = 15000;

function pickOutcome(score: number, beiTriggered: boolean): Outcome {
  if (beiTriggered) return 'anachronism';
  if (score === 3) return 'perfect';
  if (score === 2) return 'minor_breach';
  return 'total_disgrace';
}

type Phase = 'acts' | 'video';

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
  const [phase, setPhase] = useState<Phase>('acts');
  const [act, setAct] = useState(0);
  const completedRef = useRef(false);

  const score =
    Number(storageCorrect) +
    Number(warmingCorrect) +
    Number(drinkingCorrect);
  const outcome = pickOutcome(score, beiTriggered);
  const videoSrc = VIDEO_BY_OUTCOME[outcome];

  function finish() {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }

  // ─── Acts phase timer ───────────────────────────────────────
  // Advances one act per ACT_DURATION ms. After the 3rd act, a 600 ms grace
  // window lets the final pinyin/particles linger before we cut to video.
  useEffect(() => {
    if (phase !== 'acts') return;
    if (act >= 3) {
      const t = setTimeout(() => setPhase('video'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setAct((a) => a + 1), ACT_DURATION);
    return () => clearTimeout(t);
  }, [phase, act]);

  // ─── Video phase safety timeout ─────────────────────────────
  useEffect(() => {
    if (phase !== 'video') return;
    const t = setTimeout(finish, VIDEO_SAFETY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Duck background music during the video phase ───────────
  // Only the video phase emits `cinematic-start` / `cinematic-end` — the
  // 3-act recap is silent gameplay UI and the soundtrack stays on for it.
  useEffect(() => {
    if (phase !== 'video') return;
    window.dispatchEvent(new Event('cinematic-start'));
    return () => {
      window.dispatchEvent(new Event('cinematic-end'));
    };
  }, [phase]);

  // ─── Video phase render ─────────────────────────────────────
  if (phase === 'video') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finish}
          onError={finish}
          className="w-full h-full object-contain"
        />
        <button
          type="button"
          onClick={finish}
          aria-label="Skip cinematic"
          className="absolute bottom-6 right-6 px-4 py-2 rounded-md bg-black/60 border border-bronze/60 text-bronze-light hover:bronze-glow text-xs uppercase tracking-[0.3em]"
        >
          Skip ›
        </button>
      </div>
    );
  }

  // ─── Acts phase render ──────────────────────────────────────
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
      {/* Preload the upcoming video silently during the acts so playback
          starts instantly when we transition. */}
      <link rel="preload" as="video" href={videoSrc} />

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
