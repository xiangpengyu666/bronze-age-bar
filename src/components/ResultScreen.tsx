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

  return (
    <div className="min-h-screen flex flex-col items-center px-8 py-10 ink-fade">
      <div className="text-bronze-light/70 uppercase tracking-widest text-sm">
        {occasion?.name_english}
      </div>
      <h1 className="text-5xl text-bronze-light mt-2 mb-2">
        {TIER_LABEL[outcome]}
      </h1>
      <div className="text-foreground/70 italic mb-8">
        Score: {score} / 3{beiTriggered && ' — Anachronism Detected'}
      </div>

      <div className="flex gap-12 items-start max-w-5xl">
        <div className="flex-shrink-0">
          <WineMeter fillPercent={fill} label="Wine Meter" />
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {slots.map((s) => {
              const v = vesselById(s.id);
              const expected = s.expected ? vesselById(s.expected) : null;
              return (
                <div
                  key={s.label}
                  className={`bronze-border rounded-lg p-3 bg-[#0d0d1a]/80 ${
                    s.correct ? 'border-gold' : ''
                  }`}
                >
                  <div className="text-xs text-bronze-light/60 uppercase">
                    {s.label}
                  </div>
                  <div className="text-bronze-light text-lg">
                    {v?.name_chinese} {v?.name_english}
                  </div>
                  <div
                    className={`text-xs mt-1 ${s.correct ? 'text-gold' : 'text-red-400'}`}
                  >
                    {s.correct ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                  {!s.correct && expected && (
                    <div className="text-xs text-foreground/70 mt-2">
                      Expected: <span className="text-bronze-light">{expected.name_chinese} {expected.name_english}</span>
                      <br />
                      <span className="italic">{expected.short_description}</span>
                    </div>
                  )}
                  {v && (
                    <div className="text-[11px] text-foreground/60 mt-2 border-t border-bronze/30 pt-1">
                      {v.historical_fact}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bronze-border rounded-lg p-5 bg-[#0d0d1a]/80 mb-6">
            <div className="text-xs uppercase tracking-widest text-bronze-light/60 mb-2">
              The Court Records
            </div>
            <div className="text-foreground/90 leading-relaxed italic">
              {story.text}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onReplay}
              className="px-6 py-3 bronze-border rounded-md bg-bronze/20 hover:bronze-glow text-bronze-light"
            >
              Play Again
            </button>
            <Link
              href="/gallery"
              className="px-6 py-3 bronze-border rounded-md bg-[#0d0d1a]/80 hover:bronze-glow text-bronze-light"
            >
              View Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
