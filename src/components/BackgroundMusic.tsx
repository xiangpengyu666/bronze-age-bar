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
  // `ducked` is transient: the <Cinematic> component dispatches
  // `cinematic-start` / `cinematic-end` window events while it plays an
  // outcome video, and we pause background music for the duration so the
  // soundtrack doesn't fight the cinematic. Separate from the user's own
  // mute preference (which is persistent).
  const [ducked, setDucked] = useState(false);

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

  // Listen for cinematic ducking events.
  useEffect(() => {
    const onStart = () => setDucked(true);
    const onEnd = () => setDucked(false);
    window.addEventListener('cinematic-start', onStart);
    window.addEventListener('cinematic-end', onEnd);
    return () => {
      window.removeEventListener('cinematic-start', onStart);
      window.removeEventListener('cinematic-end', onEnd);
    };
  }, []);

  // Drive the underlying <audio> element based on the muted / ducked state.
  useEffect(() => {
    if (!hydrated) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = DEFAULT_VOLUME;

    if (muted || ducked) {
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
  }, [hydrated, muted, ducked]);

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
        // Hidden while a cinematic ducks the music — the bottom-right corner
        // belongs to the cinematic's Skip button during that window, and the
        // music control would be a no-op anyway (audio is paused).
        className={`fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center bronze-border bg-[#0d0d1a]/85 text-bronze-light hover:bronze-glow text-lg transition-shadow ${ducked ? 'hidden' : ''}`}
      >
        <span aria-hidden>{muted ? '🔇' : '🔊'}</span>
      </button>
    </>
  );
}
