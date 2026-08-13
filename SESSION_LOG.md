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
