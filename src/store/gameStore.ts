'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GamePhase, OccasionId, Selections } from '@/types';

interface GameState {
  phase: GamePhase;
  occasion: OccasionId | null;
  selections: Selections;
  discovered: string[];

  setPhase: (p: GamePhase) => void;
  setOccasion: (o: OccasionId) => void;
  selectVessel: (
    slot: 'storage' | 'warming' | 'drinking',
    vesselId: string,
  ) => void;
  reset: () => void;
  discover: (ids: string[]) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      phase: 'start',
      occasion: null,
      selections: { storage: null, warming: null, drinking: null },
      discovered: [],

      setPhase: (phase) => set({ phase }),
      setOccasion: (occasion) => set({ occasion }),
      selectVessel: (slot, vesselId) =>
        set((s) => ({
          selections: { ...s.selections, [slot]: vesselId },
        })),
      reset: () =>
        set({
          phase: 'start',
          occasion: null,
          selections: { storage: null, warming: null, drinking: null },
        }),
      discover: (ids) =>
        set((s) => ({
          discovered: Array.from(new Set([...s.discovered, ...ids])),
        })),
    }),
    {
      name: 'sip-or-slip-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ discovered: s.discovered }),
    },
  ),
);
