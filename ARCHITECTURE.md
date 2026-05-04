# ARCHITECTURE.md — Sip or Slip: The Bronze Age Bar

**Project:** Sip or Slip: The Bronze Age Bar  
**Developer:** Xiangpeng Yu  
**Product Manager:** Cindy Yang
**Date:** 2026-04-06  
**Status:** Architecture Review Phase

---

## 1. System Overview

This document defines the architectural approach for a casual browser-based game that teaches Western players about ancient Chinese bronze ritual vessels through interactive gameplay and pre-written narrative feedback.

**Core Responsibilities:**
- Game state management (occasion, selections, wine meter)
- Card pool randomization and occasion-mapping logic
- Consequence cinematic orchestration with particle effects
- Story lookup from pre-generated story library
- Session-based collection progress tracking

---

## 2. Data Model

### 2.1 Vessel Registry (`vessels.json`)

All 14 vessels stored in normalized JSON schema. Single source of truth for vessel metadata, animations, and historical context.

```json
{
  "vessels": [
    {
      "id": "zhuo",
      "name_pinyin": "Zhuo",
      "name_english": "Ceremonial Wine Vessel",
      "category": "storage",
      "capacity_ml": 3000,
      "us_equivalent": "A large wine bottle (magnum)",
      "valid_occasions": ["state_dinner", "governor_summit"],
      "short_description": "The grandest storage vessel, used only in the most formal ceremonies.",
      "historical_fact": "Ancient texts mention this vessel as the vessel of rulers.",
      "slip_description": "You've chosen the emperor's private wine collection.",
      "wine_meter_fill": null,
      "image_asset": "zhuo.svg",
      "animation_asset": "zhuo.json"
    }
  ]
}
```

**Schema Rationale:**
- **id:** Unique key for runtime lookups and state management
- **category:** Enum ("storage" | "warming" | "drinking") for pool selection
- **valid_occasions:** Maps occasion ID to correct/incorrect outcomes
- **wine_meter_fill:** Populated for drinking vessels only; null for storage/warming
- **image_asset / animation_asset:** Filenames for CDN delivery

### 2.2 Occasion Registry (`occasions.json`)

```json
{
  "occasions": [
    {
      "id": "state_dinner",
      "name_english": "State Dinner at the White House",
      "flavor_text": "The Emperor himself has invited you. Every gesture is being watched.",
      "hidden_rank": "Son of Heaven",
      "rank_label": "Highest rank - formal imperial level",
      "american_equivalent": "The President's formal state banquet",
      "correct_drinking_vessel": "zhi",
      "wine_meter_target": 60,
      "wine_meter_min": 40,
      "wine_meter_max": 70,
      "background_asset": "state_dinner_bg.svg",
      "emoji": "🏛️"
    }
  ]
}
```

### 2.3 Game Session State

Session state in browser `sessionStorage` with optional Supabase sync for collection progress.

```typescript
interface GameSession {
  session_id: string;
  current_game: {
    occasion_id: string;
    step_1_selection: { vessel_id: string; is_correct: boolean } | null;
    step_2_selection: { vessel_id: string; is_correct: boolean } | null;
    step_3_selection: { vessel_id: string; is_correct: boolean } | null;
    wine_meter_fill: number;
    wine_meter_outcome: "underfill" | "target" | "overflow" | null;
    cinematic_phase: "idle" | "playing" | "complete";
    story_key: string | null;
  };
  collection_progress: {
    discovered_vessels: Set<string>;
    total_discovered: number;
  };
  timestamp_started: number;
}
```

**State Mutations:**
- **Step 1 Selection:** Set `step_1_selection`, clear previous states
- **Step 2 Selection:** Set `step_2_selection`
- **Step 3 Selection:** Set `step_3_selection`, calculate Wine Meter fill
- **Cinematic Complete:** Set `cinematic_phase` to "complete"
- **Result Screen Mount:** Generate `story_key` from outcomes and wine meter
- **Collection Update:** Union `discovered_vessels` with all 3 vessels from round

### 2.4 Story Library (`stories.json`)

Pre-written stories organized by outcome tier and wine meter state. Zero latency, no API calls.

```json
{
  "stories": {
    "perfect_ceremony": [
      "You nailed every step. The Emperor is impressed. You're definitely getting invited back.",
      "The ceremony flows like silk. The court nods in approval. You've mastered the ancient ways.",
      "Perfect execution. Not a single vessel out of place. The ancestors would be proud.",
      "Your timing is impeccable. Every movement deliberate. They're taking notes for history."
    ],
    "minor_breach_underfill": [
      "You showed up with a shot glass mentality. The lords are politely confused.",
      "Not enough wine. You'll be remembered as the cautious one.",
      "You went light on the wine. Everyone noticed the restraint."
    ],
    "minor_breach_overflow": [
      "You poured like it was happy hour. The ceremony continued, but the napkins were busy.",
      "Too ambitious with the wine. Everyone noticed. Memories were hazy.",
      "You brought barbarian-sized portions. The rituals survived, but just barely."
    ],
    "disgrace_wrong_storage": [
      "You picked the wrong storage vessel. The wine spilled everywhere. It's all downhill from here.",
      "Step one: catastrophic failure. The servants are already gossiping.",
      "You broke protocol immediately. The ceremony never recovered."
    ],
    "disgrace_wrong_warming": [
      "You chose the wrong warming vessel. The wine is the wrong temperature. Everything tastes like regret.",
      "The warming vessel is completely wrong. Now the wine is angry at you too.",
      "Wrong warming vessel. The Emperor is questioning your ancestors' judgment."
    ],
    "disgrace_wrong_drinking": [
      "You selected the wrong drinking vessel. Security escorted you out for historical violations.",
      "You picked the wrong drinking vessel. The ceremony stopped. Everyone stared. You left quietly.",
      "Wrong drinking vessel. The Emperor's disappointment is palpable. You've dishonored your family."
    ],
    "bei_special": [
      "A cup? That won't exist for another 500 years. You've somehow time-traveled to the Han Dynasty mid-ceremony. The Emperor is confused. The historians are furious.",
      "You brought a Han Dynasty cup to a Zhou Dynasty ritual. You've broken the timeline. The Secret Service has questions.",
      "Wrong millennium, friend. That cup doesn't belong here. You've upset both the Emperor and physics."
    ]
  }
}
```

**Story Key Generation Logic:**

```typescript
function generateStoryKey(
  outcomes: [boolean, boolean, boolean],
  wine_meter_outcome: string,
  vessel_ids: [string, string, string]
): string {
  // Check for special Bei case first
  if (vessel_ids.includes("bei")) {
    return "bei_special";
  }

  const [correct1, correct2, correct3] = outcomes;
  
  // Perfect ceremony
  if (correct1 && correct2 && correct3 && wine_meter_outcome === "target") {
    return "perfect_ceremony";
  }
  
  // Minor breach - wine meter issue
  if (correct1 && correct2 && correct3 && wine_meter_outcome === "underfill") {
    return "minor_breach_underfill";
  }
  if (correct1 && correct2 && correct3 && wine_meter_outcome === "overflow") {
    return "minor_breach_overflow";
  }
  
  // Total disgrace - wrong vessel selection
  if (!correct1) {
    return "disgrace_wrong_storage";
  }
  if (!correct2) {
    return "disgrace_wrong_warming";
  }
  if (!correct3) {
    return "disgrace_wrong_drinking";
  }
}
```

**Story Retrieval:**

```typescript
function getStory(story_key: string): string {
  const story_library = loadStoriesJSON();
  const story_array = story_library.stories[story_key];
  
  if (!story_array || story_array.length === 0) {
    return "You survived the ceremony. That's something.";
  }
  
  // Return random story from category
  return story_array[Math.floor(Math.random() * story_array.length)];
}
```

### 2.5 Collection Persistence

```json
{
  "collection_record": {
    "user_session_id": "uuid-xxx",
    "discovered_vessels": ["jue", "jia", "zhi"],
    "last_updated": 1712428800000,
    "total_discovered": 3
  }
}
```

**Storage Strategy:**
1. **Primary:** `sessionStorage` (fast, in-memory, session-scoped)
2. **Optional:** Supabase `public.collections` table for cross-session persistence
   - Query on mount: `SELECT discovered_vessels WHERE session_id = $1`
   - Upsert on result screen: save discovered vessels

---

## 3. Tech Stack Justification

| Layer | Tech | Justification |
|-------|------|---------------|
| **Framework** | Next.js 14 | SSR, image optimization, fast development cycle |
| **Styling** | Tailwind CSS + vanilla CSS | Rapid iteration, custom animations, bronze textures |
| **State** | Zustand | Simple API, session-scoped game state, collection tracking |
| **Particles** | tsparticles | GPU-accelerated, gold/smoke effects, customizable |
| **Animations** | Lottie (lottie-react) | Pre-made vessel animations from assets |
| **Stories** | JSON file + code lookup | Zero latency, easy to modify, no API dependency |
| **Database** | Supabase (optional) | PostgreSQL, session auth, REST API |
| **Hosting** | Vercel | Native Next.js support, instant preview URLs |
| **Asset CDN** | Vercel CDN | SVG/Lottie/webm auto-cached |

### 3.1 Client-Only Architecture

No backend API calls except optional Supabase. Game is entirely client-side:
- Occasion selection → session state only
- Vessel selections → immediate feedback, no server sync
- Story lookup → O(1) JSON query, zero latency
- Collection progress → sessionStorage persistence

**Benefits:**
- Zero operational overhead
- Instant story display (no loading spinner)
- Works offline if assets cached
- Accelerated development timeline
- No API costs

---

## 4. Game Logic Architecture

### 4.1 Card Pool Randomization

```typescript
function drawCardPool(
  step: 1 | 2 | 3,
  occasion: Occasion
): Vessel[] {
  const vessels = loadVesselRegistry();
  
  if (step === 1) {
    const storage_vessels = vessels.filter(v => v.category === "storage");
    const drawn = randomSample(storage_vessels, 3);
    const decoy_pool = vessels.filter(
      v => v.category === "warming" || v.category === "drinking"
    );
    const decoy = randomSample(decoy_pool, 1);
    return shuffle([...drawn, ...decoy]);
  }
  
  if (step === 2) {
    const warming = vessels.filter(v => v.category === "warming");
    const decoys = vessels.filter(
      v => (v.category === "storage" || v.category === "drinking") && v.id !== "jue"
    );
    return shuffle([...warming, ...randomSample(decoys, 2)]);
  }
  
  if (step === 3) {
    const correct = vessels.find(
      v => v.id === occasion.correct_drinking_vessel
    );
    const other_drinking = vessels.filter(
      v => v.category === "drinking" && v.id !== correct.id
    );
    const decoys = randomSample(other_drinking, 3);
    return shuffle([correct, ...decoys]);
  }
}
```

### 4.2 Correctness Validation

```typescript
function validateSelection(
  step: 1 | 2 | 3,
  vessel_id: string,
  occasion_id: string
): boolean {
  const occasion = loadOccasion(occasion_id);
  const vessel = loadVessel(vessel_id);
  
  if (step === 1 || step === 2) {
    return (step === 1 && vessel.category === "storage") ||
           (step === 2 && vessel.category === "warming");
  }
  
  if (step === 3) {
    return vessel_id === occasion.correct_drinking_vessel;
  }
}
```

### 4.3 Wine Meter Calculation

```typescript
function calculateWineMeterFill(vessel_id: string): number {
  const vessel = loadVessel(vessel_id);
  return vessel.wine_meter_fill || 0;
}

function classifyWineMeterOutcome(
  fill: number,
  occasion: Occasion
): "underfill" | "target" | "overflow" {
  if (fill < occasion.wine_meter_min) return "underfill";
  if (fill > occasion.wine_meter_max) return "overflow";
  return "target";
}
```

### 4.4 Cinematic Orchestration

Consequence cinematic is pure CSS/SVG animation, no AI-driven logic:

```typescript
async function playConsequenceCinematic(
  selections: [Vessel, Vessel, Vessel],
  outcomes: [boolean, boolean, boolean],
  occasion: Occasion
): Promise<void> {
  for (let i = 0; i < 3; i++) {
    const vessel = selections[i];
    const is_correct = outcomes[i];
    
    await renderBackgroundForAct(occasion, i);
    
    const lottiePlayer = renderLottieAnimation(
      vessel.animation_asset,
      is_correct ? "correct_entry" : "wobble_spill"
    );
    
    if (is_correct) {
      triggerGoldParticles(lottiePlayer.element);
    } else {
      triggerGreySmokeParticles(lottiePlayer.element);
    }
    
    await sleepMs(4000);
    applyInkWashTransition();
  }
  
  if (outcomes.every(o => o === true)) {
    await playParticleVideoFullscreen("victory_particle.webm");
  }
}
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
<GameContainer>
  ├─ <GameLayout>
  │  ├─ <OccasionCard /> (top corner, persistent)
  │  ├─ <WineMeterDisplay /> (Step 3 onward)
  │  └─ <GamePhaseRouter />
  │     ├─ <OccasionSelectionPhase />
  │     ├─ <VesselSelectionPhase />
  │     ├─ <ConsequenceCinematicPhase />
  │     └─ <ResultScreenPhase />
  ├─ <CollectionMenu />
  │  └─ <VesselCollectionGrid />
  └─ <GameMenu />
```

### 5.2 Key Components

| Component | Responsibilities |
|-----------|------------------|
| `<GameContainer>` | Initialize session, load registries, manage phase routing |
| `<OccasionSelectionPhase>` | Display 3 occasion cards, update session.occasion_id |
| `<VesselSelectionPhase>` | Generate pool, validate selection, update step state |
| `<ConsequenceCinematicPhase>` | Play Lottie animations, trigger particles, 5–10s delay |
| `<ResultScreenPhase>` | Display results, lookup story, update collection |
| `<CollectionMenu>` | Display silhouettes vs. unlocked vessels, progress counter |

---

## 6. File Structure

```
sip-or-slip/
├─ public/
│  ├─ assets/
│  │  ├─ vessels/
│  │  │  ├─ zhuo.svg
│  │  │  ├─ zhuo.json (Lottie)
│  │  │  └─ ... (13 more)
│  │  ├─ backgrounds/
│  │  │  ├─ state_dinner_bg.svg
│  │  │  ├─ governor_summit_bg.svg
│  │  │  └─ backyard_bbq_bg.svg
│  │  └─ video/
│  │     └─ victory_particle.webm
│  └─ data/
│     ├─ vessels.json
│     ├─ occasions.json
│     └─ stories.json
├─ src/
│  ├─ components/
│  │  ├─ GameContainer.tsx
│  │  ├─ GameLayout.tsx
│  │  ├─ OccasionSelectionPhase.tsx
│  │  ├─ VesselSelectionPhase.tsx
│  │  ├─ VesselCardGrid.tsx
│  │  ├─ VesselCard.tsx
│  │  ├─ ConsequenceCinematicPhase.tsx
│  │  ├─ ResultScreenPhase.tsx
│  │  ├─ WineMeterDisplay.tsx
│  │  ├─ CollectionMenu.tsx
│  │  └─ CollectionCard.tsx
│  ├─ lib/
│  │  ├─ gameLogic.ts
│  │  │  ├─ validateSelection()
│  │  │  ├─ calculateWineMeterFill()
│  │  │  ├─ classifyWineMeterOutcome()
│  │  │  ├─ drawCardPool()
│  │  │  └─ generateStoryKey()
│  │  ├─ vessels.ts
│  │  ├─ occasions.ts
│  │  ├─ stories.ts
│  │  ├─ sessionState.ts
│  │  └─ animations.ts
│  ├─ hooks/
│  │  ├─ useGameState.ts (Zustand store)
│  │  ├─ useVesselPool.ts
│  │  └─ useCollectionProgress.ts
│  ├─ pages/ (Next.js routing)
│  │  ├─ index.tsx (main game)
│  │  └─ _app.tsx
│  ├─ styles/
│  │  ├─ globals.css
│  │  ├─ wine-meter.css
│  │  ├─ cinematic.css
│  │  └─ particles.css
│  └─ types/
│     ├─ game.ts
│     ├─ vessel.ts
│     └─ occasion.ts
├─ tailwind.config.js
├─ next.config.js
├─ package.json
└─ README.md
```

---

## 7. Performance & Scalability

### 7.1 Frontend Optimization

- **Asset bundling:** SVG/JSON files pre-bundled, cached via Vercel CDN
- **Lottie:** Tree-shake unused states; pre-load Step 3 Lottie before cinematic
- **Particles:** GPU acceleration; limit to 100–200 per effect
- **Wine Meter:** Pure CSS animations, leverage `transform` and `opacity`
- **Image optimization:** Next.js `<Image>` component with responsive sizes

### 7.2 Story Lookup Performance

- O(1) JSON object lookup
- No network latency
- Instant story display on result screen
- No loading spinner required

### 7.3 Deployment Checklist

- [ ] `.env.local` configured (Supabase URL/key if used)
- [ ] `.env.local` in `.gitignore`
- [ ] Asset CDN cache headers set (max-age: 31536000)
- [ ] Vercel analytics enabled
- [ ] Error logging configured
- [ ] Load testing on Vercel preview

---

## 8. Known Constraints & Risks

| Risk | Mitigation |
|------|-----------|
| **Lottie animation performance** | Pre-render key frames; test on low-end devices |
| **Particle collision** on 4K displays | Limit particle count; use CSS transforms |
| **Asset delivery** (SVG corruption) | Validate SVG syntax in CI/CD; compress with `svgo` |
| **Collection state loss** | Persist to Supabase if critical; else accept session-only scope |
| **Cross-browser animation** | Test Chrome, Firefox, Safari; use vendor prefixes |

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
describe("validateSelection", () => {
  it("accepts any storage vessel for Step 1", () => {
    expect(validateSelection(1, "zhuo", "state_dinner")).toBe(true);
    expect(validateSelection(1, "yi", "state_dinner")).toBe(true);
  });

  it("accepts only occasion-correct vessel for Step 3", () => {
    expect(validateSelection(3, "zhi", "state_dinner")).toBe(true);
    expect(validateSelection(3, "jue", "state_dinner")).toBe(false);
  });
});

describe("generateStoryKey", () => {
  it("returns bei_special for Bei vessel", () => {
    const key = generateStoryKey([true, true, true], "target", ["zhuo", "jia", "bei"]);
    expect(key).toBe("bei_special");
  });

  it("returns perfect_ceremony for all correct + target wine meter", () => {
    const key = generateStoryKey([true, true, true], "target", ["zhuo", "jia", "zhi"]);
    expect(key).toBe("perfect_ceremony");
  });
});
```

### 9.2 Integration Tests

- Occasion selection → Step 1 draws correct pool
- Step 1 correct → Step 2 evaluates correctly
- Step 3 selection with wine_meter in range → cinematic plays
- Story key generation → correct story retrieved

### 9.3 Manual Testing

- [ ] Desktop Chrome: all 3 occasions, all 14 vessels
- [ ] Desktop Firefox: cinematic animations
- [ ] Desktop Safari: particle effects, CSS filters
- [ ] Vercel preview: deployed assets load correctly
- [ ] Story lookup: instant display, no loading delay

---

## 10. Handoff & Approval

**Architecture Review Checkpoint (Week 3):**
- [ ] Proposer reviews and approves ARCHITECTURE.md
- [ ] `vessels.json` populated with all 14 entries
- [ ] `occasions.json` with 3 entries
- [ ] `stories.json` with all story categories (7 categories × 3–4 stories each = ~24 stories)
- [ ] Tech stack confirmed

**Development Milestones:**
- **Week 5:** Core game loop (selections, wine meter, result screen)
- **Week 7:** Cinematic animations + collection screen
- **Week 8:** Final deployment to Vercel, all acceptance criteria passing

---

## 11. Environment Variables

```bash
# .env.local (optional, if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# Optional Sentry for error logging
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/xxxx
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-06  
**Ready for Development:** Yes