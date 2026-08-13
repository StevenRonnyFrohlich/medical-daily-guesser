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
