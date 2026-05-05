# Sip or Slip — The Bronze Age Bar

A short browser game that teaches Western players about ancient Chinese bronze ritual vessels through a simulated drinking ceremony. Pick a social occasion, then choose the correct storage / warming / drinking vessel at each step. Wrong choices trigger humorous animations; right ones unlock a Perfect Ceremony cinematic.

This README is written for someone who wants to **clone the repo and run the exact same build the developer (Xiangpeng) sees on his machine**. Follow it top-to-bottom — every step has been verified.

---

## What you'll see when it runs

- **`/`** — landing page with two buttons: *Begin Ritual* (gold) and *Vessel Collection* (bronze)
- **`/game`** — pick an occasion, then 3 steps of vessel selection, then a 15-second cinematic, then the result screen with two side-by-side wine meters (your pour vs. expected)
- **`/gallery`** — all 14 bronze vessels grouped by category; clicking one opens an interactive 3D model viewer

If your screen looks meaningfully different from this, something is wrong — see *Troubleshooting* at the bottom.

---

## 1. Prerequisites

Install these once. **Versions matter** — the project is built against Node 20+ and Next 16.

| Tool | Minimum version | How to check |
| --- | --- | --- |
| **Node.js** | 20.x or newer | `node -v` |
| **npm** | 10.x (ships with Node 20) | `npm -v` |
| **Git** | any recent | `git --version` |

If `node -v` shows 18 or lower, install Node 20 from <https://nodejs.org/> (LTS is fine). On Windows, the Node installer also installs npm. **Don't use yarn or pnpm — `package-lock.json` is committed and tested with npm.**

You also need a modern desktop browser:
- **Chrome** or **Edge** is recommended (best WebGL performance)
- **Firefox** works
- **Safari** works but model rotation may be slightly slower
- **Mobile browsers are not supported** — the game expects a desktop viewport

---

## 2. Clone the repo

Open a terminal (PowerShell on Windows, Terminal on macOS) and run:

```bash
git clone https://github.com/GIX-Luyao/final-project-codebase-Qianyu3126.git
cd final-project-codebase-Qianyu3126
git checkout From-Xiangpeng
```

You should now be on the `From-Xiangpeng` branch. Verify with:

```bash
git status
```

Output should say `On branch From-Xiangpeng`.

---

## 3. Install dependencies

```bash
npm install
```

This will take 1–2 minutes the first time. It downloads:
- **Next.js 16** (the framework)
- **React 19**
- **Three.js + @react-three/fiber + @react-three/drei** (the 3D engine)
- **zustand** (game state), **tailwindcss 4** (styling), **tsparticles + lottie-react** (effects)

You may see a few `deprecated` warnings — those are upstream and harmless.

When it finishes you should see `added N packages` with no red `npm ERR!` lines. If you do see errors, jump to *Troubleshooting → npm install fails*.

---

## 4. Run the dev server

```bash
npm run dev
```

After 3–5 seconds you'll see something like:

```
   ▲ Next.js 16.2.4 (Turbopack)
   - Local:        http://localhost:3000
   ✓ Ready in 2.1s
```

Open <http://localhost:3000> in your browser.

**That's it.** The full game is now playable locally. Keep the terminal open while you're testing — closing it stops the server.

---

## 5. Walk through the game (so you know it's working)

To verify everything is wired up, do one full playthrough:

1. **Landing page** — click **Begin Ritual** (the gold button)
2. **Occasion** — pick *Backyard BBQ* (the easiest scoring path)
3. **Storage step** — pick **壶 Hu** (the everyday wine flask). You'll see a card with a 3D-looking bronze thumbnail and a 🔍 magnifying glass on hover — clicking the thumbnail itself opens a full 3D viewer modal you can rotate with the **middle mouse button** and zoom with the scroll wheel
4. **Warming step** — pick **斝 Jiǎ** (the tripod warmer)
5. **Drinking step** — pick **角 Jiǎo** (the horn cup, marked Backyard BBQ)
6. **Cinematic** — a ~15-second three-act sequence plays. Each act shows the rotating model with gold particles (correct) or a wobble shake (wrong). The bottom shows the Chinese character and a gold pinyin label
7. **Result screen** — you should see:
   - "Perfect Ceremony" title in gold
   - Three small gold dots (3/3 correct)
   - **Two wine meters side by side** — yours (gold) and Expected (teal-green) at 80%
   - Three vessel cards with thumbnails and descriptions
   - A "Court Records" panel with a story about your ceremony
   - *Play Again* and *View Collection* buttons
8. **Click *View Collection*** — you should see all 14 vessels grouped by Storage / Warming / Drinking. Click any to open the 3D viewer

If any of this is missing or broken, the most likely culprit is asset loading — see *Troubleshooting*.

---

## 6. Stopping and restarting

- **Stop**: Press **Ctrl+C** in the terminal running `npm run dev`
- **Restart**: Just run `npm run dev` again — no clean step needed

If you want a permanent copy that doesn't need a dev server (and is faster):

```bash
npm run build
npm run start
```

This compiles a production build then serves it on the same `http://localhost:3000`. Slightly faster page loads, but harder to edit code (no hot reload).

---

## 7. Project layout (only if you're curious)

You don't need to read this to run the project — it's here so you know where things live.

```
src/
├── app/                  # Next.js routes
│   ├── page.tsx          # Landing page
│   ├── game/page.tsx     # Game phase machine (occasion → ... → result)
│   └── gallery/page.tsx  # Vessel collection
├── components/
│   ├── OccasionCard.tsx  # The 3 occasion buttons on game start
│   ├── VesselCard.tsx    # Single vessel card (game step)
│   ├── ModelViewer.tsx   # The 3D canvas (used inside modals only)
│   ├── WineMeter.tsx     # The bronze fill gauge
│   ├── Cinematic.tsx     # The 3-act cinematic
│   ├── ResultScreen.tsx  # End-of-game result page
│   └── Collection.tsx    # The /gallery grid + modal
├── data/
│   ├── vessels.ts        # All 14 vessels (sourced from 123/SPEC.md)
│   ├── occasions.ts      # The 3 occasions
│   └── stories.json      # Fallback story bank
└── store/gameStore.ts    # Zustand store for the phase machine

public/
├── models/               # 14 optimized GLB 3D models (~43 MB total)
├── thumbs/               # Pre-rendered WebP thumbnails for cards (~95 KB total)
├── decor/                # Homepage frieze image
└── images/occasions/     # The 3 occasion background images
```

The vessel descriptions and slip messages all come from `123/SPEC.md` (the original product spec). If you want to tweak text, edit that file first, then port the change into `src/data/vessels.ts`.

---

## Troubleshooting

### "npm install" fails with `EACCES` or permission errors (macOS/Linux)

You probably installed Node with `sudo`. Fix with:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

Then re-run `npm install`.

### "npm install" fails with errors about Node version

Run `node -v`. If it's below 20.x, upgrade Node from <https://nodejs.org/> and run `npm install` again.

### `npm run dev` starts but the page is blank or shows errors

This almost always means a stale build cache. Stop the server (Ctrl+C), then on Windows PowerShell run:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

On macOS / Linux:

```bash
rm -rf .next
npm run dev
```

### The 3D models don't show up — I see "Loading…" forever or a blank box

Open the browser DevTools (F12) → Network tab → reload the page → click on a vessel card. Look for any request to `/models/<name>.glb` showing a **404**. If you see one:

```bash
ls public/models/
```

You should see 11 `.glb` files including `gu.glb` and `jiao.glb`. If files are missing, your `git clone` was incomplete — re-clone or run `git lfs pull` (this repo doesn't currently use LFS, but checking doesn't hurt).

### The 3D models show up but look black / textureless

Hard-refresh the browser (Ctrl+Shift+R / Cmd+Shift+R) to drop cached HDR maps. The bronze surfaces need an environment cubemap to look reflective; if drei's HDR fetch was blocked once, refreshing usually fixes it.

### My machine slows down or freezes when opening the game / gallery

This was a known issue in an earlier build of the project but has been fixed — every card now uses a static thumbnail and only one 3D viewer is alive at a time (when an Inspect modal is open). If you're seeing it now, you're probably running on hardware below the project minimum: any Intel integrated GPU from 2018 or newer, or any discrete GPU, should be fine. If you're on a 2015-era integrated GPU, performance may be uncomfortable.

### Chinese characters render as boxes (□□□)

Your browser doesn't have a CJK font installed. On Windows, install the *Microsoft YaHei* or *SimSun* font (both ship with Windows 10/11 by default — verify under Settings → Fonts). On macOS, *PingFang* is built in.

### The pages load but everything is at the wrong size / wrong layout

The game is designed for a **desktop viewport** (≥ 1280px wide). It's not mobile-friendly by design. Resize your browser window or use a larger monitor.

### I want to test the game but my collection is empty

Collection state is stored in zustand and persists per browser session. To unlock everything for testing, do a full playthrough — every vessel that appears in the cards (not just the one you click) gets added to your collection. After 3–4 playthroughs across all three occasions you'll have most of the 14 unlocked.

---

## Editing without breaking things

Most likely you don't need to edit anything to evaluate the project. But if you do:

- **Vessel text** (descriptions, slip messages, fun facts) — `src/data/vessels.ts`. Always check `123/SPEC.md` first for the canonical text
- **Occasions / hidden ranks** — `src/data/occasions.ts`
- **Styling colors** — `src/app/globals.css` (CSS custom properties for bronze, gold, ink)
- **Game flow / scoring** — `src/store/gameStore.ts` and `src/app/game/page.tsx`

Save any file and the dev server will hot-reload in 1–2 seconds. **Do not edit anything in `public/models/` or `public/thumbs/`** — those are pre-optimized assets; replacing them requires running the gltf-transform pipeline documented in `CLAUDE.md`.

---

## Getting help

If something in this README didn't work, message Xiangpeng with:
1. The exact command you ran
2. The full terminal output (copy-paste, not a screenshot)
3. Your Node version (`node -v`)
4. Your OS and browser

That's enough to debug 95% of issues.
