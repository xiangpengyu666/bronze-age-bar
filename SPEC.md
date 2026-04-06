# Sip or Slip: The Bronze Age Bar

**Client:** Cindy Yang  
**Developer:** Xiangpeng Yu  
**Agreed Development Fee:** 40 GIX Bucks  
**Last Updated:** 2026-04-06

---

## Project Overview

**Sip or Slip: The Bronze Age Bar** is a short, casual browser game that teaches Western players about ancient Chinese bronze ritual vessels through a simulated drinking ceremony. Players choose a social occasion and must select the correct bronze vessel at each step of the ceremony. Wrong choices trigger humorous animations and pre-written story outcomes; correct choices unlock a beautiful ceremony and historical knowledge.

**Target User:** English-speaking players aged 16-35, museum-goers, and casual history game fans with little or no prior knowledge of Chinese Bronze Age culture.

---

## User Stories and Acceptance Criteria

### US-01: Occasion Selection
**As a player**, I want to choose my occasion at the start of the game, so that I have a clear cultural context and know what is expected of me.

- [ ] Three occasion cards displayed with title, flavor text, and American equivalent
- [ ] Player must select one before proceeding
- [ ] Selected occasion card persists visibly in top corner throughout all three selection steps
- [ ] Occasion maps to a hidden rank that determines the correct drinking vessel

### US-02: Vessel Selection — Step 1 (Storage Vessel)
**As a player**, I want to choose a storage vessel from illustrated cards, so that I can begin the ceremony.

- [ ] 4 cards displayed: 3 random storage vessels + 1 random cross-category decoy
- [ ] Cards show only: SVG illustration, Chinese name, pinyin, English name
- [ ] No additional information is revealed on hover or tap during selection
- [ ] Selection locks after click; player cannot change answer
- [ ] Player cannot advance without making a selection

### US-03: Vessel Selection — Step 2 (Warming Vessel)
**As a player**, I want to choose a warming vessel, so that I correctly prepare the wine before drinking.

- [ ] 4 cards displayed: both warming vessels (Jia and Jue) always present + 2 random cross-category decoys
- [ ] Same card interaction rules as US-02
- [ ] Either Jia or Jue counts as a correct answer

### US-04: Vessel Selection — Step 3 (Drinking Vessel)
**As a player**, I want to choose a drinking vessel that matches my occasion, so that I follow Zhou dynasty ritual rules.

- [ ] 4 cards displayed: occasion-correct vessel always present + 3 random others from the drinking vessel pool
- [ ] Wine Meter activates and fills when selection is made
- [ ] Bei (Han Dynasty cup) triggers a special wrong-era visual flash if selected
- [ ] Only the occasion-correct vessel counts as correct

### US-05: Wine Meter
**As a player**, I want to see a visual wine meter respond to my drinking vessel choice, so that I understand the volume significance of each vessel.

- [ ] Bronze-styled meter visible from Step 3 onward
- [ ] Fills to the correct percentage based on the selected vessel's capacity
- [ ] Three visual states: underfill (pale liquid, bubble animation) / target zone (gold liquid, glow effect) / overflow (red liquid, drip animation from top)
- [ ] Caption text updates based on fill state and occasion

### US-06: Consequence Cinematic
**As a player**, I want to watch a short cinematic of my ceremony playing out, so that I see the consequences of my choices before the result is revealed.

- [ ] Three-act cinematic plays after Step 3 selection, before the result screen
- [ ] Each act presents the corresponding vessel with a correct or incorrect animation state
- [ ] Correct vessel: gold particle burst + silk ribbon CSS animation
- [ ] Wrong vessel: wobble + spill CSS animation + grey smoke particles via tsparticles
- [ ] Bei selection: screen flicker + "WRONG ERA" text overlay
- [ ] Occasion-appropriate background illustration displayed per act
- [ ] Ink-wash CSS transition between acts
- [ ] Total cinematic duration: 15-20 seconds
- [ ] Perfect outcome only: TouchDesigner exported .webm particle dissolution video plays fullscreen at end of cinematic (transparent background overlay)

### US-07: Result Screen
**As a player**, I want to see my ceremony result with explanations and a story, so that I learn what I got right or wrong and enjoy a narrative payoff.

- [ ] Outcome tier displayed: Perfect Ceremony / Minor Breach / Total Disgrace
- [ ] Wine Meter shown in final state with occasion-specific caption
- [ ] Each of the three vessels shown with a correct or incorrect indicator
- [ ] Wrong selections display the correct answer and a one-sentence explanation
- [ ] Historical fun fact revealed for every vessel that appeared this round
- [ ] Pre-written story displayed based on outcome combination (see Appendix C)
- [ ] Replay button present

### US-08: Vessel Collection
**As a player**, I want to track which vessels I have encountered across playthroughs, so that I am motivated to replay and discover all 14 vessels.

- [ ] Collection screen accessible from main menu and from the result screen
- [ ] Undiscovered vessels shown as silhouettes with "???" label
- [ ] Discovered vessels display: illustration, Chinese name, pinyin, English name, short description, historical fact
- [ ] Collection state persists within the same browser session
- [ ] Progress counter displayed: "X / 14 vessels discovered"

---

## Desired Specifications

### Outcome Story System

The result screen displays a pre-written story selected by the game based on the player's outcome combination. Stories are authored in advance by the proposer using AI writing tools and delivered to the developer as a static content file.

**Story selection logic:**

The game selects a story based on three inputs:
- Occasion chosen (state_dinner / governor_summit / backyard_bbq)
- Number of correct selections (0-1 = total_disgrace / 2 = minor_breach / 3 = perfect)
- Whether Bei (wrong-era cup) was selected at any step

**Story bank requirements:**
- Minimum 3 unique stories per outcome tier per occasion = 27 base stories
- Minimum 3 additional stories for any round where Bei was selected = 30 stories total
- Stories are stored in a static JSON file: stories.json
- Each story is 3-5 sentences, under 100 words
- Each story includes at least one American cultural comparison
- Bei stories must open with a time-travel reference
- The developer selects a story randomly from the matching pool each round

**Story file schema:**

```json
{
  "id": "state_dinner_perfect_01",
  "occasion": "state_dinner",
  "outcome_tier": "perfect",
  "bei_triggered": false,
  "text": "Story text here.",
  "media": {
    "type": "video",
    "src": "videos/state_dinner_perfect_01.webm"
  }
}
```

### Tech Stack

- Frontend: Next.js
- Database: Supabase (session-based collection progress)
- Particles: tsparticles (npm library)
- Lottie: lottie-react (npm library)
- Hosting: Vercel

### Asset Specifications

The proposer is responsible for delivering the following assets to the developer before Week 5:

| Asset Type | Format | Quantity | Notes |
|------------|--------|----------|-------|
| Vessel illustrations | .svg | 13 files (Jue shared across warming and drinking categories) | Consistent style, transparent background |
| Vessel animations | .json (Lottie) | 14 files | Entry animation per vessel |
| Victory particle video | .webm | 1 file | Transparent background, 5-10 seconds, triggered on perfect outcome only |
| Occasion backgrounds | .svg or .png | 3 files | White House banquet hall / Ancient assembly hall / Courtyard BBQ, ink-wash style |
| Story content file | .json | 1 file | Minimum 30 pre-written stories per schema above |

### Browser and Platform Requirements

- Desktop browser only; mobile layout is not required
- Must function correctly in Chrome, Firefox, and Safari (latest versions)
- No user accounts or login system
- No cross-device data persistence; collection progress is session-based only
- No sound effects or background music
- No multiplayer features

### Out of Scope

- Real-time AI API calls of any kind
- Any backend server beyond Supabase session storage
- More than 14 vessel entries in the vessel data file
- More than 30 stories in the story bank

---

## Definition of Done

A feature is considered complete when:
1. It passes all acceptance criteria listed in this document
2. The proposer has reviewed and approved the Pull Request within 48 hours
3. The feature works correctly in a modern desktop browser (Chrome, Firefox, and Safari)
4. No console errors are present in the browser developer tools

---

## Appendix A: Game Mechanic

### Complete Flow

```
Start Screen
  |
  v
Player chooses an occasion
  |
  v
Step 1: Choose a Storage Vessel
Step 2: Choose a Warming Vessel
Step 3: Choose a Drinking Vessel
  |
  v
Consequence Cinematic (15-20 seconds, 3 acts)
  |
  v
Result Screen — Wine Meter state + pre-written story + vessel explanations
  |
  v
Vessel knowledge unlock + option to replay
```

### Phase 1 — Occasion Selection

The player actively chooses one of three occasions. This maps to a hidden social rank that determines the correct drinking vessel in Step 3.

| Occasion | Flavor Text | Hidden Rank | American Equivalent |
|----------|-------------|-------------|---------------------|
| State Dinner at the White House | "The Emperor himself has invited you. Every gesture is being watched." | Son of Heaven (天子) | The President's formal state banquet |
| Governor's Summit | "Regional lords gather. Impressions matter, but there is room to breathe." | Lord (诸侯) | Multi-state political summit |
| Backyard BBQ | "A relaxed gathering among friends and colleagues. Just don't embarrass yourself." | Scholar-official (士大夫) | Casual backyard cookout |

The selected occasion card is always visible in the top corner during Steps 1-3, showing the occasion name and a one-line vibe reminder (e.g., "Formal. Imperial. No mistakes.").

### Phase 2 — Three-Step Vessel Selection

Each step displays 4 vessel cards drawn from the full vessel pool. Each card shows only the vessel illustration, Chinese name, pinyin pronunciation, and English name. No descriptions are shown during selection. Full descriptions are revealed on the result screen.

**Step 1 — Storage Vessel**

Full pool: Zun, Yi, Lei, You, Hu, Gong, Bu (7 vessels)

- 3 cards drawn randomly from the storage vessel pool
- 1 cross-category decoy drawn randomly from the warming or drinking pool
- Any true storage vessel = correct answer
- Selecting a decoy = wrong answer

**Step 2 — Warming Vessel**

Full pool: Jia, Jue (2 vessels)

- Both Jia and Jue always appear
- 2 cross-category decoys drawn randomly from storage or drinking pool
- Selecting Jia or Jue = correct answer
- Selecting a decoy = wrong answer

**Step 3 — Drinking Vessel**

Full pool: Jue, Gu, Zhi, Jiao, Bei (5 vessels)

- The correct vessel for the player's occasion always appears
- 3 other vessels drawn randomly from the remaining drinking pool
- Only the occasion-correct vessel = correct answer
- Bei is a permanent wrong-answer decoy that triggers a special wrong-era response

**Occasion-to-Drinking-Vessel Mapping:**

| Occasion | Correct Vessel | Capacity | US Equivalent | Historical Basis |
|----------|---------------|----------|---------------|-----------------|
| State Dinner | Zhi (觯) | ~600ml | Starbucks Venti | "Zun zhe ju zhi" — The noble raises the Zhi (Liji) |
| Governor's Summit | Gu (觚) | ~400ml | Starbucks Grande | Mid-rank vessel appropriate for lords |
| Backyard BBQ | Jiao (角) | ~800ml | A full pint | "Bei zhe ju jiao" — The humble raises the Jiao (Liji) |

### Phase 3 — Wine Meter

A bronze-styled Wine Meter is visible from Step 3 onward and fills based on the drinking vessel selected.

**Capacity and fill values:**

| Vessel | Capacity | Meter Fill |
|--------|----------|------------|
| Jue (爵) | ~200ml | 20% |
| Gu (觚) | ~400ml | 40% |
| Zhi (觯) | ~600ml | 60% |
| Jiao (角) | ~800ml | 80% |
| Bei (杯) | ~100ml | 10% |

**Target zones by occasion:**

| Occasion | Target Vessel | Target Fill | Too Little | Too Much |
|----------|--------------|-------------|------------|----------|
| State Dinner | Zhi 600ml | 60% gold | below 40% | above 70% |
| Governor's Summit | Gu 400ml | 40% gold | below 20% | above 60% |
| Backyard BBQ | Jiao 800ml | 80% gold | below 60% | 100% overflow |

**Visual design:**
- Outer frame: bronze-textured SVG border with Zhou dynasty patterns
- Fill: amber liquid with CSS wave animation
- Overflow state: liquid turns red, animated drip from the top
- Underfill state: liquid turns pale, bubble animation at the bottom
- Target state: liquid turns gold, subtle glow effect

### Phase 4 — Consequence Cinematic

A 15-20 second cinematic plays after all three selections, before the result screen. It has three acts corresponding to each vessel selected.

```
Act 1 — The Pour    (storage vessel enters, wine is poured)
Act 2 — The Warm    (warming vessel enters, wine is heated)
Act 3 — The Drink   (drinking vessel enters, ceremony concludes)
```

Per-act visual states:

| Selection Result | Visual |
|-----------------|--------|
| Correct | Vessel rises from below, gold particle burst, silk ribbon CSS animation |
| Wrong category | Vessel wobbles, tilts, wine spills via CSS liquid animation, grey smoke particles |
| Wrong era (Bei) | Screen flickers, "WRONG ERA" text overlay flashes, vessel glitches and disappears |

Visual layer stack per act:
1. Background: occasion-specific ink-wash illustration
2. Vessel: SVG + Lottie animation
3. Particles: tsparticles (gold for correct, grey smoke for wrong)
4. Transition: CSS filter blur + opacity fade between acts

If all 3 selections are correct and the Wine Meter is gold, the cinematic ends with the TouchDesigner .webm particle dissolution video playing fullscreen over the scene as a transparent overlay.

### Phase 5 — Result Screen

**Outcome tiers:**

| Score | Tier |
|-------|------|
| 3/3 correct + gold Wine Meter | Perfect Ceremony |
| 2/3 correct | Minor Breach |
| 0-1/3 correct | Total Disgrace |

The result screen displays the outcome tier, the Wine Meter in its final state with an occasion-specific caption, a correct or incorrect indicator for each of the three vessels, the correct answer and a one-sentence explanation for any wrong selections, a historical fun fact for every vessel that appeared this round, a pre-written story selected from the story bank, and a replay button.

---

## Appendix B: Bronze Vessel Data

### Data Schema

```json
{
  "id": "string",
  "name_chinese": "string",
  "name_pinyin": "string",
  "name_english": "string",
  "category": "storage | warming | drinking",
  "capacity_ml": "number | null",
  "us_equivalent": "string | null",
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "string",
  "historical_fact": "string",
  "slip_description": "string",
  "wine_meter_fill": "number | null",
  "image_asset": "string",
  "animation_asset": "string"
}
```

### Storage Vessels (7 vessels)

**Zun (尊) — Ritual Wine Vessel**
```json
{
  "id": "zun",
  "name_chinese": "尊",
  "name_pinyin": "Zūn",
  "name_english": "Ritual Wine Vessel",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": null,
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "The most prestigious storage vessel in Zhou dynasty ceremonies. Tall, wide-mouthed, and often shaped like an animal — elephant, rhinoceros, owl, or tiger.",
  "historical_fact": "The character Zun is the root of the modern Chinese word for respect (zunzhong). Owning a fine Zun signaled both wealth and ritual authority.",
  "slip_description": "You chose the most important vessel in the room just to store the wine. No one said anything. They did not have to.",
  "wine_meter_fill": null,
  "image_asset": "zun.svg",
  "animation_asset": "zun.json"
}
```

**Yi (彝) — Square Ritual Vessel**
```json
{
  "id": "yi",
  "name_chinese": "彝",
  "name_pinyin": "Yí",
  "name_english": "Square Ritual Vessel",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": null,
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "A rectangular or square bronze container used to store ritual wine. Often covered with dense taotie (monster mask) patterns and used exclusively in formal ancestral ceremonies.",
  "historical_fact": "The Yi was considered one of the six major ritual bronze categories in the Zhou dynasty. Its square shape symbolized the earth in ancient Chinese cosmology.",
  "slip_description": "You grabbed the sacred ancestral vessel like it was a cooler at a tailgate. Your ancestors are filing a formal complaint.",
  "wine_meter_fill": null,
  "image_asset": "yi.svg",
  "animation_asset": "yi.json"
}
```

**Lei (罍) — Large Storage Jar**
```json
{
  "id": "lei",
  "name_chinese": "罍",
  "name_pinyin": "Léi",
  "name_english": "Large Storage Jar",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": "A full keg",
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "One of the largest bronze storage vessels, used to hold wine before a ceremony. Typically round or square with a lid, featuring bold decorative bands and animal-shaped handles.",
  "historical_fact": "The Lei appears in the Book of Songs (Shijing): 'We have a guest; let the Lei be brought out.' It was a vessel of hospitality and abundance.",
  "slip_description": "You hauled in a vessel the size of a keg to a formal imperial banquet. Logistically impressive. Socially catastrophic.",
  "wine_meter_fill": null,
  "image_asset": "lei.svg",
  "animation_asset": "lei.json"
}
```

**You (卣) — Oval Spirit Container**
```json
{
  "id": "you",
  "name_chinese": "卣",
  "name_pinyin": "Yǒu",
  "name_english": "Oval Spirit Container",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": null,
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "An oval vessel with a swing handle and lid, used to store a special fragrant wine called ju chang used in ritual libations. One of the most distinctive shapes in Bronze Age China.",
  "historical_fact": "The You was specifically associated with storing ju chang, a black millet wine infused with fragrant herbs and used in shamanistic rituals to summon ancestral spirits.",
  "slip_description": "This vessel was meant for summoning ancestors, not for serving guests. There is an awkward spiritual energy at the table now.",
  "wine_meter_fill": null,
  "image_asset": "you.svg",
  "animation_asset": "you.json"
}
```

**Hu (壶) — Everyday Wine Flask**
```json
{
  "id": "hu",
  "name_chinese": "壶",
  "name_pinyin": "Hú",
  "name_english": "Everyday Wine Flask",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": "A water pitcher",
  "valid_occasions": ["backyard_bbq", "governor_summit"],
  "short_description": "A general-purpose long-necked vessel used to store and sometimes pour wine. Far more common and less prestigious than the Zun or Yi — it was the everyday flask of the Bronze Age.",
  "historical_fact": "By the Warring States period, the Hu had become so common that it appeared in everyday household use, not just ceremonial contexts — the ancient equivalent of bringing your own bottle.",
  "slip_description": "You brought a pitcher. To a State Dinner. At the White House. With the Emperor watching.",
  "wine_meter_fill": null,
  "image_asset": "hu.svg",
  "animation_asset": "hu.json"
}
```

**Gong (觥) — Penalty Cup Vessel**
```json
{
  "id": "gong",
  "name_chinese": "觥",
  "name_pinyin": "Gōng",
  "name_english": "Penalty Cup Vessel",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": "The vessel equivalent of a red card",
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "A large, often animal-shaped vessel (typically a horned beast) used as a penalty cup at banquets. When someone broke the rules of ceremony, they were made to drink from the Gong.",
  "historical_fact": "The phrase gong chou jiao cuo, still used in modern Chinese, describes a lively banquet scene where penalty cups and tally sticks are flying. The Gong was the ancient equivalent of a drinking game punishment.",
  "slip_description": "You served wine in the punishment cup. Everyone immediately assumed someone was in trouble. They looked at you. They were right.",
  "wine_meter_fill": null,
  "image_asset": "gong.svg",
  "animation_asset": "gong.json"
}
```

**Bu (瓿) — Small Storage Jar**
```json
{
  "id": "bu",
  "name_chinese": "瓿",
  "name_pinyin": "Bù",
  "name_english": "Small Storage Jar",
  "category": "storage",
  "capacity_ml": null,
  "us_equivalent": "A mason jar",
  "valid_occasions": ["backyard_bbq"],
  "short_description": "A small, round, wide-mouthed jar used to store wine or sauces. Squat and practical, the Bu was more utilitarian than ceremonial — the ancient mason jar.",
  "historical_fact": "The Bu was frequently used to store not just wine but also fermented sauces and food, making it one of the most versatile vessels of the Shang and Zhou periods.",
  "slip_description": "You showed up to the Governor's Summit with what is essentially a mason jar. Points for authenticity. Zero points for everything else.",
  "wine_meter_fill": null,
  "image_asset": "bu.svg",
  "animation_asset": "bu.json"
}
```

### Warming Vessels (2 vessels)

**Jia (斝) — Ritual Wine Warmer**
```json
{
  "id": "jia",
  "name_chinese": "斝",
  "name_pinyin": "Jiǎ",
  "name_english": "Ritual Wine Warmer",
  "category": "warming",
  "capacity_ml": null,
  "us_equivalent": "An ancient milk frother — but for wine",
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "A three-legged vessel with two posts on the rim, used to warm wine over a fire before serving. The legs were designed to sit directly over heat sources, making it the original portable wine warmer.",
  "historical_fact": "The Jia is one of the oldest bronze vessel forms, appearing as early as the Erlitou culture (c. 1900-1500 BCE). It may have evolved from ceramic predecessors used in Neolithic ritual brewing.",
  "slip_description": "At least you got the warming right. One out of three is not bad. Actually, yes it is.",
  "wine_meter_fill": null,
  "image_asset": "jia.svg",
  "animation_asset": "jia.json"
}
```

**Jue (爵) — Pouring and Warming Cup**
```json
{
  "id": "jue_warming",
  "name_chinese": "爵",
  "name_pinyin": "Jué",
  "name_english": "Pouring and Warming Cup",
  "category": "warming",
  "capacity_ml": 200,
  "us_equivalent": "Starbucks Tall (12oz)",
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "The most iconic bronze vessel of ancient China — a three-legged cup with a pouring spout and a tail, used for both warming wine over a flame and drinking. The Jue could serve double duty at a ceremony.",
  "historical_fact": "The Jue is so central to Chinese bronze culture that the word itself became the root of the nobility ranking system (juewei) — the five ranks of Zhou aristocracy were literally named after this cup.",
  "slip_description": "You tried to warm the wine in a drinking cup. The wine is now lukewarm, the cup is scorched, and your host is reconsidering the invitation.",
  "wine_meter_fill": null,
  "image_asset": "jue.svg",
  "animation_asset": "jue.json"
}
```

### Drinking Vessels (5 vessels)

**Jue (爵) — Ritual Drinking Cup**
```json
{
  "id": "jue_drinking",
  "name_chinese": "爵",
  "name_pinyin": "Jué",
  "name_english": "Ritual Drinking Cup",
  "category": "drinking",
  "capacity_ml": 200,
  "us_equivalent": "Starbucks Tall (12oz) — the smallest order",
  "valid_occasions": ["state_dinner", "governor_summit", "backyard_bbq"],
  "short_description": "The most recognizable bronze vessel in Chinese history. Three-legged, with a long pouring spout, a pointed tail, and two mushroom-shaped posts on the rim. Holds about 200ml — a modest, controlled pour.",
  "historical_fact": "According to the Zhouli Kaogongji, the Jue holds exactly one sheng, approximately 200ml by modern estimation. It is the baseline unit of the Zhou drinking hierarchy — every other vessel is measured relative to the Jue.",
  "slip_description": "You ordered the Tall at a State Dinner. The Emperor has had more wine spilled at this table than you just poured.",
  "wine_meter_fill": 20,
  "image_asset": "jue.svg",
  "animation_asset": "jue_drink.json"
}
```

**Gu (觚) — Slender Ceremonial Goblet**
```json
{
  "id": "gu",
  "name_chinese": "觚",
  "name_pinyin": "Gū",
  "name_english": "Slender Ceremonial Goblet",
  "category": "drinking",
  "capacity_ml": 400,
  "us_equivalent": "Starbucks Grande (16oz) — the safe middle choice",
  "valid_occasions": ["governor_summit"],
  "short_description": "A tall, slender, elegantly flared goblet used by nobility at formal banquets. Its elongated form made it visually impressive — the ancient equivalent of drinking from a champagne flute at a state reception.",
  "historical_fact": "The Gu holds two sheng, or approximately 400ml. Its tall narrow form required a steady hand — spilling from a Gu at a formal banquet was considered a serious breach of etiquette.",
  "slip_description": "A fine choice — for a Governor's Summit. You are at a Backyard BBQ. Your champagne-flute energy is making everyone uncomfortable.",
  "wine_meter_fill": 40,
  "image_asset": "gu.svg",
  "animation_asset": "gu.json"
}
```

**Zhi (觯) — Noble's Drinking Vessel**
```json
{
  "id": "zhi",
  "name_chinese": "觯",
  "name_pinyin": "Zhì",
  "name_english": "Noble's Drinking Vessel",
  "category": "drinking",
  "capacity_ml": 600,
  "us_equivalent": "Starbucks Venti (20oz) — the power move",
  "valid_occasions": ["state_dinner"],
  "short_description": "A rounded, slightly oval drinking vessel reserved for the highest-ranking guests at a ceremony. Dignified in proportion, significant in volume — the Zhi signals status without ostentation.",
  "historical_fact": "The Liji (Book of Rites) states directly: 'The noble raises the Zhi; the humble raises the Jiao.' The Zhi is the vessel of rank by ancient law.",
  "slip_description": "You grabbed the Emperor's cup at a Backyard BBQ. It is not wrong exactly — it is just a lot. Your host noticed. Everyone noticed.",
  "wine_meter_fill": 60,
  "image_asset": "zhi.svg",
  "animation_asset": "zhi.json"
}
```

**Jiao (角) — Commoner's Horn Cup**
```json
{
  "id": "jiao",
  "name_chinese": "角",
  "name_pinyin": "Jiǎo",
  "name_english": "Commoner's Horn Cup",
  "category": "drinking",
  "capacity_ml": 800,
  "us_equivalent": "A full pint — the classic BBQ order",
  "valid_occasions": ["backyard_bbq"],
  "short_description": "The largest standard drinking vessel, shaped like an animal horn, used by lower-ranking guests at ceremonies. Holds nearly a full pint — generous, unpretentious, and built for drinking rather than display.",
  "historical_fact": "The Liji pairs the Jiao directly with the Zhi as opposites in the drinking hierarchy: noble uses Zhi, humble uses Jiao. Unlike the Zhi, the Jiao has no posts on the rim, making it slightly less formal in appearance.",
  "slip_description": "You showed up to the White House State Dinner with the ancient equivalent of a pint glass. The Secret Service has questions.",
  "wine_meter_fill": 80,
  "image_asset": "jiao.svg",
  "animation_asset": "jiao.json"
}
```

**Bei (杯) — Han Dynasty Cup**
```json
{
  "id": "bei",
  "name_chinese": "杯",
  "name_pinyin": "Bēi",
  "name_english": "Han Dynasty Drinking Cup",
  "category": "drinking",
  "capacity_ml": 100,
  "us_equivalent": "An espresso shot — tiny and historically misplaced",
  "valid_occasions": [],
  "short_description": "A small, simple drinking cup that became popular during the Han dynasty — roughly 500 years after the Zhou ritual bronze age. Selecting this vessel means you have arrived at the wrong century entirely.",
  "historical_fact": "The lacquerware Bei replaced bronze drinking vessels during the Han dynasty as lacquer production became cheaper and more widespread. Finding one at a Zhou dynasty banquet would be like bringing a smartphone to a medieval feast.",
  "slip_description": "A cup? That will not exist for another 500 years. Somehow you have managed to time-travel to the Han Dynasty mid-ceremony. The Emperor is confused. The historians are furious.",
  "wine_meter_fill": 10,
  "image_asset": "bei.svg",
  "animation_asset": "bei.json"
}
```

---

## Appendix C: Story Bank Schema

Stories are stored in stories.json and selected at runtime based on occasion, outcome tier, and whether Bei was chosen. The proposer delivers this file to the developer as a completed asset before Week 7.

**Selection logic:**
1. Filter stories by occasion matching the player's chosen occasion
2. Filter by outcome_tier matching the result (perfect / minor_breach / total_disgrace)
3. If Bei was selected at any step, filter by bei_triggered: true; otherwise filter by bei_triggered: false
4. Select one story randomly from the filtered pool

**Minimum story counts:**

| Occasion | Perfect | Minor Breach | Total Disgrace | Bei Triggered |
|----------|---------|--------------|----------------|---------------|
| state_dinner | 3 | 3 | 3 | 3 |
| governor_summit | 3 | 3 | 3 | 3 |
| backyard_bbq | 3 | 3 | 3 | 3 |

Total minimum: 30 stories

**Story file schema:**

```json
{
  "id": "state_dinner_perfect_01",
  "occasion": "state_dinner",
  "outcome_tier": "perfect",
  "bei_triggered": false,
  "text": "Story text here.",
  "media": {
    "type": "video",
    "src": "videos/state_dinner_perfect_01.webm"
  }
}
```
