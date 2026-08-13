# Session log

Append-only. One entry per request. See `.cursor/rules/session-log.mdc`.

## 2026-08-13 — Build the medical daily guesser

**User**
- Make a browser daily guesser called What is this (microscope), medical edition, four options, 50+ hard microscope images (malaria, sperm, liver, skin, leukemia, and peers).

**Actions**
- Built a static client: `index.html`, `css/styles.css`, `js/specimens.js`, `js/game.js`.
- Catalogued 62 public-domain Commons/CDC fields with lookalike distractors, daily seed, streak, lab mode.
- Wikimedia search was rate-limited; filenames were batch-verified before shipping.

**Outcome**
- `success` for a local playable game.
- Note: some Commons files with generic names (e.g. `Neutrophil.jpg`) may be illustrations rather than smears. Recheck if a case looks too diagrammatic. Hotlinked images need a network.

## 2026-08-13 — Switch GitHub account, host cheaply, start repo, remember session logs

**User**
- How do I change which GitHub account this session uses?
- Think through cheap hosting, with a Buy Me a Coffee banner if possible.
- When logged into StevenRonnyFrohlich (not VitruvianMD), create `medical-daily-guesser` and start the project.
- Remember, each session in this repo, to log the user message, what was done, and success / notes.

**Actions**
- Checked `gh auth status`: active account was `StevenFrohlich` (Vitruvian Medical Diagnostics), not `StevenRonnyFrohlich`.
- Started `gh auth login --web` so a second account can be added, then switched.
- Added always-on Cursor rule `.cursor/rules/session-log.mdc` and this log.
- Added a coffee banner driven by `js/config.js`, plus GitHub Pages notes in the README.

**Outcome**
- `semi-success` / in progress at time of writing.
- Repo create and push are blocked until `gh` is `StevenRonnyFrohlich`. Do not create the repo under `StevenFrohlich` or `VitruvianMD`.
- Coffee slug is a guess (`stevenronnyfrohlich`). Confirm or replace after the BMC page exists.

## 2026-08-13 — GitHub login and first push

**User**
- Finish switching to StevenRonnyFrohlich, then push `cursor/medical-daily-guesser`.

**Actions**
- Device login completed as `StevenRonnyFrohlich`.
- Created public repo `StevenRonnyFrohlich/medical-daily-guesser` and pushed the existing branch.

**Outcome**
- `success`. Repo: https://github.com/StevenRonnyFrohlich/medical-daily-guesser
- Local git author is still `SteveFrohlich <steve.frohlich@vitruvianmd.com>`. Change that later if the personal account should own commits.

## 2026-08-13 — Six-field daily tray, more images, Wordle share

**User**
- Each day the user must guess 6 things, with Wordle-like boxes for hits and misses. Add more pictures and a copy/share result.

**Actions**
- Reworked daily play in `js/game.js` / `index.html` / `css/styles.css`: six seeded fields, tray boxes, resume mid-day, share text `🟩🟥` plus score.
- Added 25 Commons-verified specimens (87 total). Share URL lives in `js/config.js`.
- Lab mode is now a practice tray of six and does not affect streak.

**Outcome**
- `success` locally. Streak now means "finished today's six," not a perfect score.
- GitHub Pages is still not enabled, so the share URL may 404 until Pages is turned on.
- Recheck a few new generic Commons names (`Lymphocyte.jpg`, `Spleen.jpg`, `Neuron.jpg`) if any look like diagrams in play.

## 2026-08-13 — Easy / Medium / Hard daily modes

**User**
- Let the person who lands on the page pick Easy, Medium, and Hard. They can do all three each day.

**Actions**
- Added a lobby with three mode cards. Each mode is its own six-field daily tray with its own streak and progress.
- Easy = difficulty 1–2, Medium = 3, Hard = 4–5. Practice on a card does not touch that mode's streak.
- Share text now includes the mode name. Storage key bumped to `wit-microscope-med-v3`.

**Outcome**
- `success` locally. Old v2 single-tray progress will not carry over.
- Hard pool is thinner than Easy; if we add more images, bias them to difficulty 4–5.

## 2026-08-13 — Modes are content tracks, not easy/medium/hard

**User**
- Do not use Easy / Medium / Hard. Use human morphology (liver, skin, muscle, squamous, nerves), parasites and organisms, and abnormal morphologies (sickle cell, leukemia, schistocytes of TTP, etc.).

**Actions**
- Replaced the three lobby modes with `morphology`, `organisms`, and `abnormal`.
- Assigned tracks in `js/specimens.js`: normal histology and normal blood cells → morphology; parasites/bacteria/fungi → organisms; disease shapes including CMV and ground-glass hepatocytes → abnormal.
- Storage key bumped to `wit-microscope-med-v4`.

**Outcome**
- `success` locally. Easy/medium/hard progress will not carry over.
- The only liver image is ground-glass hepatocytes, so it sits in Abnormal, not Human morphology. Add a normal hepatocyte field later.
- Abnormal is the smallest pool (14). Worth adding more disease morphologies next.

## 2026-08-13 — Catalog counts and production plan

**User**
- Quantify how many options each category has. How would we productionalize this with a bought domain, hosting, registration, and a leaderboard?

**Actions**
- Counted the live catalog: 87 fields — morphology 30, organisms 43, abnormal 14.
- Wrote a production plan: Cloudflare domain + Pages, Supabase auth/scores, Worker-owned daily key, phased launch.
- Put the numbers and plan in canvases/catalog-and-production.canvas.tsx.

**Outcome**
- `success` as analysis. No product code changed.
- Abnormal repeats ~every 2.3 days; grow it before a public board.
- Do not ship a leaderboard while answers still live in the client JS.

## 2026-08-13 — Circular loupe on the specimen

**User**
- Build a CSS microscope tool: hover the image for a circular modal fixed to the mouse, scroll to enlarge the point under the cursor, like a looking glass.

**Actions**
- Added `js/loupe.js`: circular loupe follows the pointer, maps through `object-fit: cover`, wheel changes power 1.6×–10×.
- Removed the full-field click overlay. Double-click still opens the lightbox.
- Loupe uses a 2000px Commons render so zoom stays sharp.

**Outcome**
- `success` locally. Hover the ocular and scroll.
- Touch/trackpad pinch is not implemented; wheel/trackpad scroll is.
- Corners of the square ocular hide the loupe so it only lives inside the circle.

## 2026-08-13 — Loupe can zoom smaller than the base field

**User**
- Must be able to zoom out so the object in the magnifying glass is smaller than the base image.

**Actions**
- Lowered loupe minimum power from 1.6× to 0.25× and used a finer scroll step.

**Outcome**
- `success`. Scroll out until the glass shows a reduced field; 1.0× matches the base image.
