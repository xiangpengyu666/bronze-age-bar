'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { occasions, occasionById } from '@/data/occasions';
import { vessels, vesselById, vesselsByCategory } from '@/data/vessels';
import OccasionCard from '@/components/OccasionCard';
import VesselCard from '@/components/VesselCard';
import WineMeter from '@/components/WineMeter';
import Cinematic from '@/components/Cinematic';
import ResultScreen from '@/components/ResultScreen';
import type { Vessel, OccasionId } from '@/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildStorageOptions(): Vessel[] {
  const storage = vesselsByCategory('storage').filter(
    (v) => v.available !== false,
  );
  const distractorPool = vessels.filter(
    (v) => v.category !== 'storage' && v.available !== false,
  );
  const picks = shuffle(storage).slice(0, 3);
  const distractor = shuffle(distractorPool).slice(0, 1);
  return shuffle([...picks, ...distractor]);
}

function buildWarmingOptions(): Vessel[] {
  const warming = vesselsByCategory('warming').filter(
    (v) => v.available !== false,
  );
  const distractorPool = vessels.filter(
    (v) => v.category !== 'warming' && v.available !== false,
  );
  const distractors = shuffle(distractorPool).slice(0, 2);
  return shuffle([...warming, ...distractors]);
}

function buildDrinkingOptions(occasionId: OccasionId): Vessel[] {
  const occ = occasionById(occasionId)!;
  const correct = vesselById(occ.correct_drinking);
  const drinking = vesselsByCategory('drinking');
  const others = drinking.filter((v) => v.id !== occ.correct_drinking);

  // If correct vessel is unavailable (gu/jiao missing), substitute Bei to keep 4 cards.
  const correctOption =
    correct && correct.available !== false ? correct : null;

  const fillerCount = correctOption ? 3 : 4;
  const fillers = shuffle(others).slice(0, fillerCount);

  const set = correctOption ? [correctOption, ...fillers] : fillers;
  return shuffle(set);
}

export default function GamePage() {
  const phase = useGameStore((s) => s.phase);
  const occasion = useGameStore((s) => s.occasion);
  const selections = useGameStore((s) => s.selections);
  const setPhase = useGameStore((s) => s.setPhase);
  const setOccasion = useGameStore((s) => s.setOccasion);
  const selectVessel = useGameStore((s) => s.selectVessel);
  const reset = useGameStore((s) => s.reset);
  const discover = useGameStore((s) => s.discover);

  // Reset to start on first mount
  useEffect(() => {
    reset();
    setPhase('occasion');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const storageOptions = useMemo(buildStorageOptions, [phase === 'storage']);
  const warmingOptions = useMemo(buildWarmingOptions, [phase === 'warming']);
  const drinkingOptions = useMemo(
    () => (occasion ? buildDrinkingOptions(occasion) : []),
    [occasion, phase === 'drinking'],
  );

  const occObj = occasion ? occasionById(occasion) : null;

  // Correctness
  const storageVessel = selections.storage
    ? vesselById(selections.storage)
    : null;
  const warmingVessel = selections.warming
    ? vesselById(selections.warming)
    : null;
  const drinkingVessel = selections.drinking
    ? vesselById(selections.drinking)
    : null;

  const storageCorrect = storageVessel?.category === 'storage';
  const warmingCorrect = warmingVessel?.category === 'warming';
  const drinkingCorrect =
    !!drinkingVessel &&
    !!occObj &&
    drinkingVessel.id === occObj.correct_drinking;
  const beiTriggered = drinkingVessel?.id === 'bei';

  function handleOccasionPick(id: OccasionId) {
    setOccasion(id);
    discover([]);
    setPhase('storage');
  }

  function handleVesselPick(slot: 'storage' | 'warming' | 'drinking', v: Vessel) {
    selectVessel(slot, v.id);
    discover([v.id]);
    if (slot === 'storage') setPhase('warming');
    else if (slot === 'warming') setPhase('drinking');
    else setPhase('cinematic');
  }

  // ── Render phases ───────────────────────────────────────────
  if (phase === 'occasion') {
    return (
      <main className="min-h-screen px-4 sm:px-8 ink-fade flex flex-col items-center">
        <div className="flex-1 flex items-center justify-center text-center w-full">
          <div>
            <h1 className="text-4xl sm:text-5xl text-bronze-light mb-3">
              Choose Your Occasion
            </h1>
            <div className="text-foreground/60 italic text-sm sm:text-base">
              Each setting demands a different ceremony.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
          {occasions.map((o) => (
            <OccasionCard
              key={o.id}
              occasion={o}
              onClick={() => handleOccasionPick(o.id)}
            />
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          <Link
            href="/"
            className="text-bronze-light/60 hover:text-bronze-light text-2xl sm:text-3xl"
          >
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  if (phase === 'storage' || phase === 'warming' || phase === 'drinking') {
    const stepNum = { storage: '1', warming: '2', drinking: '3' }[phase];
    const stepCategory = { storage: 'Storage', warming: 'Warming', drinking: 'Drinking' }[phase];

    const options =
      phase === 'storage'
        ? storageOptions
        : phase === 'warming'
          ? warmingOptions
          : drinkingOptions;

    return (
      <main className="min-h-screen px-4 sm:px-8 ink-fade relative flex flex-col items-center">
        <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-10">
          {occObj && <OccasionCard occasion={occObj} compact />}
        </div>

        {phase === 'drinking' && drinkingVessel && (
          <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-10">
            <WineMeter
              fillPercent={drinkingVessel.wine_meter_fill ?? 0}
              label="Wine Meter"
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center text-center w-full">
          <div className="flex flex-col items-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-bronze/50 text-bronze-light/80 text-xs sm:text-sm uppercase tracking-[0.35em]"
              style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}
            >
              <span>Step</span>
              <span className="text-gold font-semibold">{stepNum}</span>
              <span className="opacity-60">/ 3</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl text-bronze-light/85 tracking-wide"
            >
              Choose a{' '}
              <span
                className="text-gold font-semibold uppercase mx-1 px-2"
                style={{
                  fontSize: '1.5em',
                  letterSpacing: '0.08em',
                  textShadow: '0 0 28px rgba(243,201,105,0.65)',
                  borderBottom: '2px solid rgba(243,201,105,0.55)',
                }}
              >
                {stepCategory}
              </span>{' '}
              Vessel
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-12">
          {options.map((v) => (
            <VesselCard
              key={v.id}
              vessel={v}
              onClick={() => handleVesselPick(phase, v)}
            />
          ))}
        </div>

        <div className="flex-1 w-full" />
      </main>
    );
  }

  if (phase === 'cinematic') {
    return (
      <Cinematic
        storage={selections.storage!}
        warming={selections.warming!}
        drinking={selections.drinking!}
        storageCorrect={storageCorrect}
        warmingCorrect={warmingCorrect}
        drinkingCorrect={drinkingCorrect}
        beiTriggered={beiTriggered}
        onComplete={() => setPhase('result')}
      />
    );
  }

  if (phase === 'result' && occasion) {
    return (
      <ResultScreen
        occasionId={occasion}
        storage={selections.storage!}
        warming={selections.warming!}
        drinking={selections.drinking!}
        storageCorrect={storageCorrect}
        warmingCorrect={warmingCorrect}
        drinkingCorrect={drinkingCorrect}
        beiTriggered={beiTriggered}
        onReplay={() => {
          reset();
          setPhase('occasion');
        }}
      />
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-bronze-light">
      Loading…
    </main>
  );
}
