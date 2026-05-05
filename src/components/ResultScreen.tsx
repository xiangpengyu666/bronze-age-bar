'use client';

import Link from 'next/link';
import { vesselById } from '@/data/vessels';
import { occasionById } from '@/data/occasions';
import storiesData from '@/data/stories.json';
import WineMeter from './WineMeter';
import type { OccasionId, OutcomeTier, StoryEntry } from '@/types';

const stories = storiesData as StoryEntry[];

interface Props {
  occasionId: OccasionId;
  storage: string;
  warming: string;
  drinking: string;
  storageCorrect: boolean;
  warmingCorrect: boolean;
  drinkingCorrect: boolean;
  beiTriggered: boolean;
  onReplay: () => void;
}

function tier(score: number, beiTriggered: boolean): OutcomeTier {
  if (beiTriggered) return 'total_disgrace';
  if (score === 3) return 'perfect';
  if (score === 2) return 'minor_breach';
  return 'total_disgrace';
}

const TIER_LABEL: Record<OutcomeTier, string> = {
  perfect: 'Perfect Ceremony',
  minor_breach: 'Minor Breach',
  total_disgrace: 'Total Disgrace',
};

export default function ResultScreen({
  occasionId,
  storage,
  warming,
  drinking,
  storageCorrect,
  warmingCorrect,
  drinkingCorrect,
  beiTriggered,
  onReplay,
}: Props) {
  const occasion = occasionById(occasionId);
  const score =
    Number(storageCorrect) +
    Number(warmingCorrect) +
    Number(drinkingCorrect);
  const outcome = tier(score, beiTriggered);

  const drinkVessel = vesselById(drinking);
  const fill = drinkVessel?.wine_meter_fill ?? 0;
  const correctDrinking = vesselById(occasion?.correct_drinking ?? '');
  const expectedFill = correctDrinking?.wine_meter_fill ?? 0;

  const targetByOccasion: Record<OccasionId, { min: number; max: number }> = {
    state_dinner: { min: 40, max: 70 },
    governor_summit: { min: 20, max: 60 },
    backyard_bbq: { min: 60, max: 100 },
  };
  const target = targetByOccasion[occasionId];

  const matchingStories = stories.filter(
    (s) =>
      s.occasion === occasionId &&
      s.outcome_tier === outcome &&
      s.bei_triggered === beiTriggered,
  );
  const story =
    matchingStories[Math.floor(Math.random() * matchingStories.length)] ??
    stories[0];

  const slots = [
    { label: 'Storage', id: storage, correct: storageCorrect, expected: null },
    { label: 'Warming', id: warming, correct: warmingCorrect, expected: null },
    {
      label: 'Drinking',
      id: drinking,
      correct: drinkingCorrect,
      expected: correctDrinking?.id ?? null,
    },
  ];

  const tierAccent: Record<OutcomeTier, string> = {
    perfect: '#f3c969',
    minor_breach: '#b89968',
    total_disgrace: '#a86060',
  };
  const accent = tierAccent[outcome];
  const correctness = [storageCorrect, warmingCorrect, drinkingCorrect];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-8 ink-fade">
      <div className="w-full max-w-[1500px]">
        <header className="flex flex-col items-center text-center mb-6">
          <div className="text-bronze-light uppercase tracking-[0.45em] text-sm">
            {occasion?.name_english}
          </div>
          <h1
            className="text-4xl sm:text-5xl mt-2 leading-none"
            style={{
              color: accent,
              textShadow: `0 0 28px ${accent}66`,
            }}
          >
            {TIER_LABEL[outcome]}
          </h1>
          <div
            className="h-px w-40 my-3"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}aa, transparent)`,
            }}
          />
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {correctness.map((c, i) => (
                <span
                  key={i}
                  className="block w-2.5 h-2.5 rounded-full"
                  style={{
                    background: c ? '#f3c969' : 'rgba(168,96,96,0.7)',
                    boxShadow: c ? '0 0 10px #f3c96988' : 'none',
                  }}
                />
              ))}
            </div>
            <div className="text-bronze-light text-sm tracking-widest uppercase">
              {score} / 3 Correct
              {beiTriggered && (
                <span className="ml-2 text-red-300">· Anachronism</span>
              )}
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">
          <section className="bronze-border rounded-xl px-4 py-4 bg-[#0d0d1a]/70 flex flex-col items-center gap-3">
            <div className="text-base uppercase tracking-[0.35em] text-bronze-light">
              Wine Meter
            </div>
            <div className="flex gap-5 items-end">
              <WineMeter
                fillPercent={fill}
                targetMin={target.min}
                targetMax={target.max}
                label="Your Pour"
              />
              <WineMeter
                fillPercent={expectedFill}
                targetMin={target.min}
                targetMax={target.max}
                label="Expected"
                variant="expected"
              />
            </div>
            {correctDrinking && (
              <div className="text-base text-foreground text-center pt-3 border-t border-bronze/30 w-full leading-relaxed">
                Expected:{' '}
                <span className="text-bronze-light font-semibold">
                  {correctDrinking.name_chinese}
                </span>{' '}
                ({correctDrinking.name_pinyin}) — {expectedFill}%
              </div>
            )}
          </section>

          <section className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-5">
              {slots.map((s) => {
                const v = vesselById(s.id);
                const expected = s.expected ? vesselById(s.expected) : null;
                const thumb = v?.model_asset
                  ? v.model_asset
                      .replace('/models/', '/thumbs/')
                      .replace(/\.glb$/, '.webp')
                  : null;
                const cardAccent = s.correct ? '#f3c969' : '#a86060';
                return (
                  <div
                    key={s.label}
                    className="rounded-xl px-5 py-4 bg-[#0d0d1a]/80 flex flex-col gap-2"
                    style={{
                      border: `1px solid ${cardAccent}77`,
                      boxShadow: `0 0 24px ${cardAccent}1a inset`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm tracking-[0.25em] uppercase text-bronze-light">
                        {s.label}
                      </div>
                      <div
                        className="text-sm tracking-widest uppercase font-semibold"
                        style={{ color: cardAccent }}
                      >
                        {s.correct ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    </div>
                    {thumb && (
                      <div
                        className="my-2 flex items-center justify-center rounded-md"
                        style={{
                          background:
                            'radial-gradient(circle at 50% 60%, rgba(243,201,105,0.10), rgba(0,0,0,0.35) 70%)',
                        }}
                      >
                        <img
                          src={thumb}
                          alt={v?.name_english ?? ''}
                          className="w-full h-32 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center">
                      {v?.name_chinese && (
                        <div className="text-2xl text-bronze-light leading-none">
                          {v.name_chinese}
                        </div>
                      )}
                      {v?.name_pinyin && (
                        <div
                          className="text-xl italic tracking-[0.15em] mt-1"
                          style={{ color: '#f3c969' }}
                        >
                          {v.name_pinyin
                            .normalize('NFD')
                            .replace(/[̀-ͯ]/g, '')}
                        </div>
                      )}
                    </div>
                    {!s.correct && expected && (
                      <div className="mt-3 pt-3 border-t border-bronze/30">
                        <div className="uppercase tracking-widest text-xs text-bronze-light mb-1">
                          Should have been
                        </div>
                        <div className="text-bronze-light font-semibold text-base">
                          {expected.name_chinese} {expected.name_english}
                        </div>
                        <div className="italic mt-2 text-foreground leading-relaxed text-base">
                          {expected.short_description}
                        </div>
                      </div>
                    )}
                    {v && (
                      <div className="mt-3 pt-3 border-t border-bronze/30 text-foreground leading-relaxed italic text-base">
                        {v.historical_fact}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="rounded-xl px-8 py-4 bg-[#0d0d1a]/80 relative"
              style={{ border: `1px solid ${accent}77` }}
            >
              <div className="absolute -top-3 left-8 px-3 bg-[#0a0a14] text-xs uppercase tracking-[0.35em] text-bronze-light">
                The Court Records
              </div>
              <div className="text-foreground leading-relaxed italic text-base">
                “{story.text}”
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Link
                href="/gallery"
                className="px-5 py-2 bronze-border rounded-md bg-[#0d0d1a]/80 hover:bronze-glow text-bronze-light text-sm uppercase tracking-widest"
              >
                View Collection
              </Link>
              <button
                onClick={onReplay}
                className="px-5 py-2 rounded-md text-sm uppercase tracking-widest font-semibold"
                style={{
                  background: `${accent}22`,
                  border: `1px solid ${accent}`,
                  color: accent,
                  boxShadow: `0 0 18px ${accent}33`,
                }}
              >
                Play Again
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
