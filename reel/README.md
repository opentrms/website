# OpenTRMS motion reel

A 15-second, 1920×1080 @ 60 fps motion-graphics reel for OpenTRMS with a soundtrack generated in code at 120 BPM.

Every frame is a pure function of time (`renderScene(t)` in `index.html`), so the renderer can
blend several sub-frame samples per frame for real motion blur (16 on fast moves, 6 elsewhere).

| Time | Scene |
|---|---|
| 0–2s | Signal: price line, "EVERY TRADE / EVENT / HASH." |
| 2–4.5s | Audit trail: hash chain, tamper glitch, verification |
| 4.5–7s | Deal lifecycle: ring of the 11 `DealStatus` states |
| 7–9.5s | By the numbers: 926 / 16 / 24 / 34 / 14 |
| 9.5–12s | AI control room: DealAgent terminal, asset classes |
| 12–15s | Finale: particles form the wordmark, logo, tagline |

Figures come from `src/data/` on the site. The terminal's counterparty ("ACME Bank") and deal terms are placeholders.

## Usage

Requires `ffmpeg` on the PATH and the site's `node_modules` installed (for the fonts).

```sh
cd reel
npm install
npx playwright install chromium   # first time only
npm run setup                     # copies fonts into reel/fonts/, writes audio.wav
npm run stills                    # preview frames → stills/
npm run render                    # full render → opentrms-reel.mp4 (~10 min)
```

`npm run stills -- 1.5,7.3,13.25` renders specific timestamps (in seconds).
For a smaller web copy: `ffmpeg -i opentrms-reel.mp4 -c:v libx264 -crf 22 -c:a copy opentrms-reel-web.mp4`.

## Files

- `index.html`: the whole animation (canvas 2D, no dependencies)
- `audio.mjs`: generates `audio.wav` (kick, clap, hats, bass, transition whooshes, riser, impact)
- `render.mjs`: serves the folder locally, drives headless Chromium frame by frame and pipes PNG frames into ffmpeg
- `fonts.mjs`: copies Inter and JetBrains Mono from `@fontsource`

Scene timings are hard-coded in both `index.html` and `audio.mjs`, so if you move a cut, update both.
