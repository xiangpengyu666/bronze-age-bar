'use client';

import { useEffect, useRef } from 'react';

/**
 * Cinematic cutscene shown between the drinking-vessel pick and the result
 * screen. Replaces the old three-act 3D model showcase with a single 10-second
 * pre-rendered video per outcome (perfect / minor / disgrace / anachronism).
 *
 * Why pre-rendered: the old version mounted a fresh <Canvas> with a fully lit
 * GLB scene per act, which cost ~3 seconds of main-thread parse + GPU upload
 * on each transition. Even after the broader 3D perf overhaul (see CLAUDE.md),
 * a sequence of three Canvases stitched on a timer was the heaviest single
 * surface in the app. Pre-rendered ink-wash animation videos are ~6 MB each,
 * stream instantly, and let us tell a richer story than a rotating model.
 *
 * The (occasion × outcome) matrix is intentionally collapsed to outcome only:
 * we ship four canonical court-scene videos and play the same one regardless
 * of whether the player picked State Dinner / Governor Summit / Backyard BBQ.
 * The occasion-specific narrative lives in the Court Records panel on the
 * result screen. See the May 2026 chat thread for the decision.
 */

interface Props {
  // Kept for API compatibility with game/page.tsx, even though storage /
  // warming / drinking ids are no longer used: the video is selected purely
  // from the correctness flags + bei flag.
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

// Source videos are 10s; allow a generous grace window before we force the
// transition in case `onended` never fires (some browsers drop the event when
// the tab loses focus mid-playback).
const SAFETY_TIMEOUT_MS = 15000;

function pickOutcome(score: number, beiTriggered: boolean): Outcome {
  if (beiTriggered) return 'anachronism';
  if (score === 3) return 'perfect';
  if (score === 2) return 'minor_breach';
  return 'total_disgrace';
}

export default function Cinematic({
  storageCorrect,
  warmingCorrect,
  drinkingCorrect,
  beiTriggered,
  onComplete,
}: Props) {
  const completedRef = useRef(false);

  const score =
    Number(storageCorrect) +
    Number(warmingCorrect) +
    Number(drinkingCorrect);
  const outcome = pickOutcome(score, beiTriggered);
  const src = VIDEO_BY_OUTCOME[outcome];

  function finish() {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }

  // Safety net in case the <video>'s `ended` event never fires.
  useEffect(() => {
    const t = setTimeout(finish, SAFETY_TIMEOUT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tell the global background music to duck while a cinematic plays. The
  // <BackgroundMusic> component in the root layout listens for these events
  // and pauses / resumes accordingly.
  useEffect(() => {
    window.dispatchEvent(new Event('cinematic-start'));
    return () => {
      window.dispatchEvent(new Event('cinematic-end'));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        key={src}
        src={src}
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
