'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Site-wide looping background music ("竹枝词").
 *
 * Mounted in the root layout so it survives client-side route changes — the
 * <audio> element stays alive across <Link> navigations between /, /game, and
 * /gallery, so playback is uninterrupted.
 *
 * Autoplay handling: browsers block <audio> from playing sound until the user
 * has interacted with the page. We try to play on mount, and if the promise
 * rejects we attach a one-shot listener for the first pointerdown/keydown
 * anywhere in the document and start playback then.
 *
 * The mute preference is persisted to localStorage so it survives reloads.
 */

const STORAGE_KEY = 'sip-or-slip-music-muted';
const DEFAULT_VOLUME = 0.35;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore preference from localStorage on first client render.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setMuted(true);
    } catch {
      // Ignore (e.g. privacy mode with storage disabled).
    }
    setHydrated(true);
  }, []);

  // Drive the underlying <audio> element based on the muted state.
  useEffect(() => {
    if (!hydrated) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = DEFAULT_VOLUME;

    if (muted) {
      audio.pause();
      return;
    }

    const tryPlay = () => {
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay blocked. Wait for the user's first gesture and retry.
          const unlock = () => {
            audio.play().catch(() => {});
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('pointerdown', unlock, { once: true });
          window.addEventListener('keydown', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
      }
    };
    tryPlay();
  }, [hydrated, muted]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore.
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/zhuzhici.mp3"
        loop
        preload="auto"
        aria-hidden
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? '开启背景音乐' : '关闭背景音乐'}
        title={muted ? '开启背景音乐' : '关闭背景音乐'}
        className="fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center bronze-border bg-[#0d0d1a]/85 text-bronze-light hover:bronze-glow text-lg transition-shadow"
      >
        <span aria-hidden>{muted ? '🔇' : '🔊'}</span>
      </button>
    </>
  );
}
