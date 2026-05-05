@AGENTS.md

# Sip or Slip — dev notes

Next.js 16 (App Router, Turbopack) + React 19 + Three.js 0.184 + @react-three/fiber 9 + @react-three/drei 10 + zustand 5 + Tailwind 4. Bronze-age wine-vessel matching game; pick a storage / warming / drinking vessel for the chosen occasion, watch the cinematic, see the result.

## Commands

```bash
npm run dev                          # dev server (Turbopack)
npm run build && npm run start       # production build + serve — use this to actually measure perf
node scripts/generate-thumbs.mjs     # one-shot regen of public/thumbs/*.webp from current public/models/*.glb
```

PowerShell on Windows: `Remove-Item -Recurse -Force .next` to nuke Next's dev cache when HMR gets weird (Turbopack caches RSC payloads aggressively in Next 16).

## Architecture

Three routes (App Router):
- `/` — landing page (`src/app/page.tsx`)
- `/game` — the matching game (`src/app/game/page.tsx`), drives a phase machine via `useGameStore` (zustand)
- `/gallery` — discovered-vessels grid (`src/app/gallery/page.tsx` → `Collection.tsx`)

Game phase machine (in `gameStore.ts`):
```
occasion → storage → warming → drinking → cinematic → result
```

Vessels are defined in `src/data/vessels.ts`. All 14 entries are now sourced from `123/SPEC.md` (Cindy's spec doc) — when editing copy (name_english, short_description, historical_fact, slip_description, us_equivalent), update SPEC.md first, then port the change here. Don't paraphrase: the spec voice (Starbucks comparisons, 《礼记》quotes, Secret Service jokes) is part of the product tone.

All 14 vessels have GLBs in `public/models/`. `gu` and `jiao` were added later — both compressed via the same gltf-transform pipeline as the rest. **`gu` had the same `KHR_materials_pbrSpecularGlossiness` issue as `zhi`/`you`** (Sketchfab export), so it needs `metalrough` conversion before `optimize`, otherwise the textures render black.

Note: `jue_warm` and `jue` are two distinct vessel ids that **share the same GLB** (`/models/jue.glb`). Anywhere the code derives an asset URL from the vessel, it must use `model_asset` not `id` (the thumbnail derivation in `VesselCard.tsx` / `Collection.tsx` does this).

## Result screen

`ResultScreen.tsx` shows two `<WineMeter>` side-by-side: the player's pour (`fillPercent` = selected drinking vessel's `wine_meter_fill`) and the expected pour (`fillPercent` = occasion's `correct_drinking` vessel's `wine_meter_fill`). Both share per-occasion target zones:

| Occasion | targetMin | targetMax |
| --- | --- | --- |
| `state_dinner` | 40 | 70 |
| `governor_summit` | 20 | 60 |
| `backyard_bbq` | 60 | 100 |

These are sourced from SPEC.md §Phase 3 — Wine Meter. The "Expected" meter passes `variant="expected"` to `<WineMeter>`, which forces a teal-green liquid color (`#7fc8a9`) regardless of fill — it's a reference, not a graded result, so it shouldn't recolor based on target match.

Outcome tiers (`perfect` / `minor_breach` / `total_disgrace`) drive an `accent` color used for the title glow, divider gradient, vessel card border, "Court Records" panel border, and Play Again button (gold / soft bronze / dim red respectively).

## Visual / button hierarchy

Two CTA tiers, used consistently across landing and gallery:
- **Primary (gold)**: `Begin Ritual`, `Back to Start`, Result screen `Play Again`. Color `#f3c969`, gold border + faint amber background + gold glow.
- **Secondary (bronze)**: `Vessel Collection`, Result screen `View Collection`. Color `#d4a574`, bronze border, much subtler glow.

Don't make secondary actions gold — the gold accent is reserved for the action you want the player to take. Pinyin throughout the app strips tone marks for display (`name_pinyin.normalize('NFD').replace(/[̀-ͯ]/g, '')`) — display Chinese characters when you want exoticism, the cleaned ASCII pinyin when you want readability. Never both with diacritics.

## The 3D pipeline (the part that previously froze the entire computer)

### What was wrong

Every `<VesselCard>` and every Gallery card mounted its own `<Canvas>` from `@react-three/fiber`. Each Canvas:
1. Creates an independent WebGL context
2. Runs its own rAF render loop
3. Mounts an `OrbitControls` instance
4. Loaded `<Environment preset="warehouse" />` — a per-Canvas HDR cubemap download, decode, and GPU upload

In the game's selection step, 4–5 cards are visible at once. In the gallery, up to 11. Browsers cap concurrent WebGL contexts (typically 8–16); past that they start dropping the oldest, causing severe stutter. Even before hitting the cap, the per-Canvas overhead (HDR + draw loop + controls) saturated the main thread.

On top of that, the GLB assets were uncompressed: 11 files totalling **377 MB** (largest single: gong.glb 69 MB, zun.glb 67 MB). Each Canvas would synchronously parse and upload textures + geometry on mount, blocking the main thread for seconds.

### What we did

**Asset compression** (one-shot, run once unless models change):
```bash
# For specular-glossiness models (zhi, you), convert workflow first:
npx gltf-transform metalrough public/models/_orig/<name>.glb /tmp/<name>-mr.glb
# Then optimize all:
npx gltf-transform optimize <input>.glb public/models/<name>.glb \
  --compress meshopt --texture-compress webp --simplify false
```
Result: **377 MB → 43 MB** (-88%). Originals backed up at `public/models/_orig/` (gitignored).

Two models (`zhi`, `you`) used GLTF's deprecated `KHR_materials_pbrSpecularGlossiness` extension — Three.js r152+ no longer ships built-in support, so their textures rendered black ("missing"). The `metalrough` step converts them to modern `metallic-roughness` PBR before optimize.

**ModelViewer changes** (`src/components/ModelViewer.tsx`):
- `frameloop="demand"` — Canvas only renders when something invalidates (initial frame + each OrbitControls interaction). Idle modal = 0% CPU.
- `dpr={[1, 1.5]}` — capped from default `[1, 2]`. Marginal visual gain at 2× for a rotating model isn't worth the per-pixel work.
- `gl.powerPreference: 'high-performance'` — hints the browser to use the discrete GPU.
- `useGLTF` → `useMemo(() => scene.clone(true), [scene])`. **Critical:** `useGLTF` returns a SHARED scene cached across all mounts of the same URL. Mutating `scene.position` to recenter the model pollutes that cache, and on the second mount Box3 sees the already-centered scene → computes center=(0,0,0) → applies a no-op offset, leaving the model in its original (uncentered) position. The orbit pivot then drifts off-axis.
- After centering, `controlsRef.current.target.set(0, 0, 0); controls.update()` — re-syncs OrbitControls' cached spherical so the first drag doesn't snap the camera.
- Lighting: hemi + 3 directional + `<Environment preset="warehouse" />`. The Environment is back **because there's now only ever one Canvas at a time** (modal-gated), so the HDR is downloaded once and cached. Bronze surfaces (metallic=1) need IBL reflections to look like bronze; without Environment they read as flat black no matter how many directional lights you add.

**Card-level 3D removal**:
- `VesselCard.tsx` and `Collection.tsx` cards render a static thumbnail (`<img src="/thumbs/<name>.webp">`), NOT a `<Canvas>`. Thumbnails are generated by `scripts/generate-thumbs.mjs` (puppeteer + Three.js, ~5–11 KB each, ~95 KB total).
- Real 3D viewer (`<ModelViewer>`) is gated behind:
  - `VesselCard`: an explicit "🔍 Inspect" button overlay on the thumbnail. Click → modal with rotatable viewer. Esc / backdrop click / × closes.
  - `Collection`: clicking the card itself opens the modal (same pattern).
- The modal is rendered via `createPortal(..., document.body)` so it escapes any parent stacking context / overflow.
- `ModelViewer` is `dynamic(() => import('./ModelViewer'), { ssr: false })` — the chunk + Three.js / drei runtime is only fetched when the user actually opens an inspect modal.

Net effect on concurrent WebGL contexts:

| Scene | Before | After |
| --- | --- | --- |
| Game selection step | 4–5 | 0 |
| Gallery | up to 11 | 0 (1 only when modal open) |
| Gallery + modal | 12 | 1 |
| Cinematic | 1 | 1 |

### Thumbnail regeneration

If you swap or recompress GLBs, regenerate thumbs:
```bash
node scripts/generate-thumbs.mjs
```
The script spins up a tiny static server, opens `scripts/thumb.html` in headless Chromium (puppeteer), loads each GLB through Three.js with the same lighting setup as ModelViewer, captures a 512×512 transparent WebP per model into `public/thumbs/`. Names match the GLB filename — `bei.glb` → `bei.webp`. The card-side URL derivation is `vessel.model_asset.replace('/models/', '/thumbs/').replace(/\.glb$/, '.webp')`.

## Misc CSS perf notes

- `globals.css` `.ink-fade` was a 0.6s **`filter: blur(8px → 0)`** animation applied to every `<main>`. Animating CSS `filter: blur()` over a viewport (or over a div containing a WebGL canvas in `Cinematic`) forces the compositor to re-rasterize everything beneath the blur every frame — extremely expensive even on a 5080 because the work is on the compositor thread, not GPU shader cores. Replaced with plain opacity fade.
- `VesselCard` had `backdrop-blur-sm` (= `backdrop-filter: blur(4px)`) per card. With 4–5 cards = 4–5 simultaneous backdrop-filter layers blurring whatever was behind. Removed.

## Adding new vessels

1. Drop the GLB into `public/models/<id>.glb` (or compress it with the gltf-transform pipeline above first).
2. Add an entry to `src/data/vessels.ts` with the right `category`, `valid_occasions`, `model_asset: '/models/<id>.glb'`, and `available: true`.
3. Run `node scripts/generate-thumbs.mjs` to add a `<id>.webp` thumbnail.
4. If the vessel category needs occasion logic (e.g. drinking vessel for a new occasion), update `src/data/occasions.ts`.
