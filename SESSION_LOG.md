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

## 2026-08-13 — Can a shared link be played?

**User**
- If I share the link to the game, can other people play right now?

**Actions**
- Checked the repo and the Pages URL. Repo is public. Pages is not enabled. `github.io` returns 404.

**Outcome**
- `success` as an answer: no public playable link yet. Clone works; localhost does not. Pages is the next step.

## 2026-08-13 — Enable GitHub Pages

**User**
- Continue after asking whether a shared link works.

**Actions**
- Enabled GitHub Pages from `cursor/medical-daily-guesser` `/`. Public URL: https://stevenronnyfrohlich.github.io/medical-daily-guesser/

**Outcome**
- `semi-success`. Pages is on; first build can take a minute. Confirm the URL loads before treating share as live.

## 2026-08-13 — BMC alternatives for South Africa

**User**
- What alternatives to Buy Me a Coffee can take small / variable amounts, from South Africa?

**Actions**
- Compared local rails (PayFast, iKofi, Yoco, Paystack) vs global tip jars (Ko-fi, BMC, PayPal). Stripe is still a poor fit for an SA merchant account.

**Outcome**
- `success` as advice. Recommended PayFast or iKofi for ZAR/EFT, plus PayPal or Ko-fi for overseas players. No code change.

## 2026-08-13 — Does Ko-fi work in South Africa?

**User**
- Would Ko-fi work even in South Africa?

**Actions**
- Checked Ko-fi’s payout rule: PayPal or Stripe only. Stripe Connect is not a normal SA merchant option; PayPal is.

**Outcome**
- `success` as advice. Yes via PayPal. Not a clean ZAR/EFT path. Confirm PayPal withdrawal (often FNB) before relying on it.

## 2026-08-14 — Similar games and a better name

**User**
- Are there similar games already? What would be a good name?

**Actions**
- Looked up daily medical guessers. Closest is Pathordle (pathology Wordle). Also Radiordle, iatroX Rounds, ScienceAlert Microscope Mystery, study quizzes.

**Outcome**
- `success` as advice. The format exists; the three trays plus loupe plus 4-option lookalikes are the differentiator. Avoid another -ordle name.

## 2026-08-14 — Brand: The Call

**User**
- Liked The Call: you are at the scope, you make the call, it could save lives. Want something in that thread.

**Actions**
- Renamed the game to The Call. Line: At the scope. Make the call.
- How-to keeps the stakes of the lab, then says this is practice, not a diagnostic tool.
- Share line is now `The Call #n`.

**Outcome**
- `success` locally. Live Pages URL updates on next push. A custom domain can wait.

## 2026-08-14 — Alternate fields per diagnosis

**User**
- Find multiple pictures of each guessable entry so that if the same item comes up a day or so later, the picture can be different.

**Actions**
- Searched Wikimedia Commons and kept only light-microscope photos (dropped diagrams, EM, maps, life cycles).
- Added a `files` array on every specimen in `js/specimens.js` (238 Commons fields total).
- `js/game.js` now picks one field from that array using the daily/practice seed, so the same diagnosis can show a different photo.

**Outcome**
- `success` locally. All 87 entries have at least 2 fields; 63 have 3 or 4. Thin leftovers: some histology (neuron, astrocyte, glomerulus, alveoli) and a few smears still only have one extra. Not pushed.

## 2026-08-14 — Domain for The Call

**User**
- What domain should I purchase for this website?

**Actions**
- Checked branding vs live collisions: thecall.com is a prayer movement; makethecall.com is a Pfizer leftover; atthescope.com is a consultancy; .game is ~$300/year.
- Recommended scopethecall.com at Cloudflare (~$10/year .com), with onthescope.com as fallback.

**Outcome**
- `success` as advice. Confirm availability at the registrar before paying; no DNS is not a guarantee.

## 2026-08-14 — Set up scopethecall.com

**User**
- Bought scopethecall.com on Cloudflare; help set it up properly.

**Actions**
- Added a `CNAME` file, pointed share URL and canonical at `https://scopethecall.com/`.
- Set GitHub Pages custom domain on `StevenRonnyFrohlich/medical-daily-guesser`.
- Cloudflare DNS: apex + `www` CNAME to `stevenronnyfrohlich.github.io`, DNS only (grey cloud).

**Outcome**
- `semi-success` until DNS and GitHub HTTPS both show live. Keep proxy off until the Pages certificate exists.

## 2026-08-14 — Mission copy and DNS check

**User**
- Added the CNAMEs. Wants a tagline: these differences take rare skill, there are not enough of those people, at least teach AI normal vs abnormal so a trained human sees the rest.

**Actions**
- Confirmed apex and www resolve to GitHub Pages.
- Added a lobby mission line, the same idea in How to play, and a README sentence.

**Outcome**
- `success` for copy (local). DNS is live; GitHub still shows `http://scopethecall.com/` until Enforce HTTPS is ticked.

## 2026-08-14 — Reframe mission; about page instead of coffee

**User**
- Rephrase the model/normal-vs-abnormal line: tools exist now to make life easier for those professionals and get more people help despite limited resources.
- Remove Buy Me a Coffee; replace with an about-the-developer page and a LinkedIn link.

**Actions**
- Rewrote lobby, How to play, and README copy.
- Removed the coffee banner and `buyMeACoffee` config.
- Added `about.html` for Steven Frohlich with LinkedIn `steven-frohlich-80150746`.

**Outcome**
- `success` locally. Not pushed.

## 2026-08-14 — Reframe tools copy toward hard diagnoses

**User**
- The “easier / more people help” line does not make sense. Say the tools make the work more engaging, strip out most of the normal work, and leave the truly difficult diagnoses that save lives.

**Actions**
- Updated lobby, How to play, about page, README, and meta description.

**Outcome**
- `success` locally. Not pushed.

## 2026-08-14 — Landing copy: try your hand

**User**
- Take the long specialist/tools paragraph off the landing page. Landing should say these are the things technologists, pathologists, and other medical professionals look at every day to save lives; try your hand and see if you have what it takes.

**Actions**
- Replaced the lobby line and meta description. Left the longer tools copy on How to play and the about page.

**Outcome**
- `success` locally. Not pushed.

## 2026-08-14 — About: VitruvianMD skills and who this is for

**User**
- Add skills from VitruvianMD: histo/cyto (gross morphology, cancer resections, LBC/Pap), hematology and rare smear-diagnosable blood disorders.
- Main aim: help people without first-world medical access; improve life worldwide, starting at the bottom.

**Actions**
- Rewrote `about.html` with those skills and that aim, still as a biomedical engineer, not as a licensed pathologist.

**Outcome**
- `success` locally. Not pushed.

## 2026-08-14 — About: unnamed startup, no VitruvianMD

**User**
- Do not mention VitruvianMD. Say he worked at a startup that began focused on the third world and had to pivot because most people will not invest in problems that affect the poor.

**Actions**
- Rewrote the opening of `about.html`. Skills stay; the company name is gone.

**Outcome**
- `success` locally. Not pushed.

## 2026-08-14 — Remove live practice; accounts later

**User**
- Live site should not offer practice. Remove that button. Add signup/login later so practice is for accounts. Auth can live on a development branch, not all in one go.

**Actions**
- Removed the Practice button, the lab deep link, and the How-to practice line. Left `startLab` in `js/game.js` for an accounts branch.

**Outcome**
- `success` locally for hiding practice. Signup/login not started. Not pushed.

## 2026-08-14 — Fuller about page from LinkedIn

**User**
- Read LinkedIn and gather data for a nicer about page. Core line: engineer medical solutions that actually help people; this is a space where we can improve the world.

**Actions**
- Pulled public LinkedIn/Wits/Rwanda workshop facts. Rewrote `about.html` with education, scope skills, unnamed startup pivot, Rwanda malaria training, The Call, and that aim. No company name.

**Outcome**
- `success` locally. LinkedIn itself would not load; used public snippets. Not pushed.

## 2026-08-14 — About: drop Rwanda, widen to Africa and the world

**User**
- Remove Rwanda specifically. The work should span Africa and the world, where a lack of medical skill costs time in saving lives.

**Actions**
- Rewrote that paragraph in `about.html`. Dropped Rwanda, CMU Africa, and RBC.

**Outcome**
- `success` locally. Not pushed.

## 2026-08-14 — Get scopethecall.com on Google

**User**
- How do I get scopethecall to appear on Google so people can start playing or seeing it?

**Actions**
- Checked the live site: DNS to GitHub Pages is live; no robots.txt or sitemap yet.
- Advised Search Console domain verify via Cloudflare TXT, sitemap, Enforce HTTPS, and a few real links.

**Outcome**
- `success` as advice. Indexing is not instant; Search Console is the lever.

## 2026-08-14 — Add robots.txt and sitemap.xml

**User**
- Please add a robots.txt and sitemap.xml, commit and push them.

**Actions**
- Added `robots.txt` (allow all, sitemap URL) and `sitemap.xml` for `/` and `/about.html`.

**Outcome**
- `success`. Pushed with this commit.

## 2026-08-14 — Neutrophil favicon

**User**
- Use a normal neutrophil as the browser tab icon.

**Actions**
- Made a Wright–Giemsa neutrophil icon and added `favicon.ico`, `favicon-32.png`, `favicon-192.png`, and `apple-touch-icon.png` on the lobby and about pages.

**Outcome**
- `success` locally. Not pushed. Hard-refresh the tab to see it.

## 2026-08-14 — Optional feedback without exposing email

**User**
- Add a feedback system so people can write feedback if they want. Do not expose the email address; deliver messages to that inbox.

**Actions**
- Wired a Feedback modal on the lobby, board footer, and about page (`js/feedback.js`).
- Posts to Formspree via `GAME_CONFIG.feedbackForm` in `js/config.js` so the inbox never appears in HTML.
- Left `feedbackForm` empty until a Formspree endpoint is pasted. Documented setup in `README.md`.

**Outcome**
- `semi-success`. UI is in place locally, not committed. Delivery starts after Formspree signup and the form URL is set in `js/config.js`.

## 2026-08-14 — Wire Formspree and ship feedback

**User**
- Gave the Formspree endpoint and said to do what I will.

**Actions**
- Set `feedbackForm` in `js/config.js` to that endpoint.
- Committed the feedback UI plus the neutrophil favicon (HTML already linked it) and pushed to `cursor/medical-daily-guesser`.

**Outcome**
- `success` if Pages deploys. Confirm the first live submission in Formspree email. Did not commit `.cursor/mcp.json`.

## 2026-08-15 — Diagnosis names and richer morphology notes

**User**
- Use diagnoses (Malaria, TTP, Leukemia) with a simple English name in brackets. Put exact scientific names in the bottom information box. Make normal human morphology more informative — WBC distribution, function, classification history.

**Actions**
- Added `js/labels.js` so buttons show diagnosis + plain English; lookalikes use the same pattern.
- Reveal box now shows the scientific name, the existing call note, and for morphology a teaching paragraph. White cells get a typical adult differential chart.
- Bumped localStorage to `wit-microscope-med-v5` so old guesses do not mismatch new labels.

**Outcome**
- `success`. Pushed as its own commit. Streaks reset once because of the storage key bump.

## 2026-08-15 — Teaching notes for abnormal and organisms

**User**
- Give abnormal morphology and parasites/bugs the same richer information box as normal morphology. Also propose other trays to add.

**Actions**
- Added `about` text for every abnormal and organism case in `js/labels.js`.
- Added comparison charts: malaria species, the four leukemias, and MAHA causes for TTP/schistocytes.

**Outcome**
- `success`. Pushed as its own commit.

## 2026-08-15 — Add a Cytology tray

**User**
- Add Cytology as a new tray.

**Actions**
- Added a fourth lobby mode and 20 Pap/LBC cases in `js/specimens.js` (NILM, SIL, glandular, infections, artifacts). Commons filenames checked via the API.
- Wired diagnosis labels, teaching notes, and Bethesda / glandular charts in `js/labels.js`.
- Lobby, how-to, footer count (107), and README now say four trays.

**Outcome**
- `success`. Pushed as its own commit. Deep link: `index.html?tray=cytology`.

## 2026-08-15 — Split feature commits and pushes

**User**
- Commit and push, different features, different push.

**Actions**
- Pushed diagnosis names (`04a56a6`), then abnormal/organism teaching notes (`05c18de`), then the cytology tray as separate commits.

**Outcome**
- `success`.

## 2026-08-15 — Diff-tab commit and push

**User**
- Stage the work, commit, and push this branch. Exclude unrelated files.

**Actions**
- Checked `cursor/medical-daily-guesser`: already matched origin at `d23e84e`. Only leftover was `.cursor/mcp.json`, which was not committed.

**Outcome**
- `success`. Nothing new to push.

## 2026-08-15 — Cloudflare accounts and moderated submissions

**User**
- Implement the Cloudflare accounts / moderated UGC plan. Do not edit the plan file. Finish all todos.

**Actions**
- Worked on `cursor/accounts` (not Pages). Worker `the-call-api` + D1 schema `the-call` + R2 binding `the-call-fields`; `GET /catalog` returns extra trays + approved specimens only.
- Magic-link auth (Resend when keyed, `devLink` locally), `account.html`, session cookie.
- `submit.html` uploads (1–3 jpeg/png/webp, 8 MB, EXIF strip, attestations) to local R2; `admin.html` approve/reject.
- Game fetches catalog, merges specimens and unofficial trays; lobby Log in / Submit a field; `catalogUrl` left empty until `api.scopethecall.com` is live.
- Remote D1 exists; `wrangler deploy` failed until R2 is enabled in the dashboard (error 10042). Apex/`www` DNS left on GitHub Pages. Custom domain not put in `wrangler.jsonc` routes (that broke local magic-link hosts).

**Outcome**
- `semi-success`. Local pipeline verified (login → submit → approve → `/catalog` extra tray). Remote Worker/R2/`api.scopethecall.com` still need dashboard R2 + deploy + custom domain. Do not switch GitHub Pages to this branch yet. Not committed.

## 2026-08-15 — Enable R2 and attach API domain

**User**
- I have activated R2.

**Actions**
- Created R2 bucket `the-call-fields`. Re-applied remote D1 schema. Deployed Worker `the-call-api`.
- Set `SESSION_SECRET`. Attached custom domain `api.scopethecall.com` via `wrangler deploy --domain` (not wrangler.jsonc routes).
- Confirmed `GET https://api.scopethecall.com/catalog` returns empty trays/specimens. Apex `scopethecall.com` still GitHub Pages.
- Set `catalogUrl` to `https://api.scopethecall.com`. Localhost still uses `http://localhost:8787`.

**Outcome**
- `semi-success`. API is live. Still need `ADMIN_EMAIL` and `RESEND_API_KEY` secrets. GitHub Pages source unchanged (`cursor/accounts` not live). Not committed.

## 2026-08-15 — Admin email and Resend key

**User**
- Asked what the Resend API key is; gave admin email for the Worker secret.

**Actions**
- Set production `ADMIN_EMAIL` via wrangler. Updated local `.dev.vars` the same way.
- Did not create or invent a Resend key; that comes from the Resend dashboard.

**Outcome**
- `semi-success`. Admin secret is set. Magic-link mail still needs `RESEND_API_KEY` and a verified sending domain.

## 2026-08-15 — Resend API key added

**User**
- Said RESEND_API_KEY has been added.

**Actions**
- Confirmed the Worker secrets list includes `RESEND_API_KEY`, `ADMIN_EMAIL`, and `SESSION_SECRET`. Did not send a test login email.

**Outcome**
- `success` for the secret being present. Login mail still needs `scopethecall.com` verified in Resend (Worker sends from `login@scopethecall.com`). GitHub Pages source unchanged.

## 2026-08-15 — Switch GitHub Pages to accounts branch

**User**
- Lets switch to this branch now.

**Actions**
- Committed accounts work on `cursor/accounts` (no `.dev.vars`, no `.cursor/mcp.json`).
- Pushed the branch and set GitHub Pages source to `cursor/accounts` `/`. Apex DNS left on GitHub Pages.

**Outcome**
- `success` if Pages build is `cursor/accounts`. Live site should show Log in / Submit; catalog from `api.scopethecall.com`.

## 2026-08-21 — Signups list and crowd second-opinion

**User**
- Treat magic-link login as a real signup (emails visible to admin in D1 / admin.html). After each field call, show the crowd split (e.g. “62% said malaria”). No leaderboard. Fold in HEAD /catalog, Resend 502 errors, optional RESEND_FROM.

**Actions**
- Added D1 `field_calls` plus admin `GET /admin/users`.
- Worker: unique vote per user or `call_anon` cookie, IP/cookie rate limits, HEAD `/catalog`, Resend 502 + `RESEND_FROM`.
- Game reveal shows the crowd split after a call; lobby still plays anonymously and has a light Log in.
- Documented `wrangler d1 execute the-call --remote --file=worker/migrations/0001_field_calls.sql` and Worker deploy. Did not switch GitHub Pages. Did not commit secrets.

**Outcome**
- `semi-success`. Code is on `cursor/signups-crowd-a659`. Local `npm test` (8/8) and wrangler `--local` checks passed: unique votes, admin-only user list, magic-link session cookie, HEAD `/catalog`.
- `wrangler whoami` is not authenticated here, so remote D1 migrate + Worker deploy were not run.
- ManagePullRequest failed (`must be a collaborator`). Open from: https://github.com/StevenRonnyFrohlich/medical-daily-guesser/compare/cursor/accounts...cursor/signups-crowd-a659
- Leftover: apply `worker/migrations/0001_field_calls.sql` remotely, `wrangler deploy`, merge to `cursor/accounts`. Do not switch GitHub Pages from this work.

## 2026-08-23 — Merge signups-crowd into accounts

**User**
- Merge existing `cursor/signups-crowd-a659` into `cursor/accounts` as-is. Do not rewrite the feature or add product work. Open a PR targeting `cursor/accounts` (not main) and merge if checks are green. Do not run wrangler or deploy. Do not add apex MX or change the sitemap. GitHub Pages stays on `cursor/accounts`.

**Actions**
- Confirmed a clean fast-forward: two commits (`57a34b6`, `bc3f87a`), 0 conflicts, no sitemap/MX diffs.
- `ManagePullRequest` and `gh pr create` both failed (`must be a collaborator` / `Resource not accessible by integration`).
- Fast-forwarded local `cursor/accounts` and pushed `cddff04..bc3f87a` to origin. Did not change GitHub Pages source.
- Ran `npm test` (8/8). Did not run wrangler or deploy.

**Outcome**
- `semi-success`. Merge: yes. PR: no (no collaborator permission to open one; after the push there is also no remaining diff).
- `cursor/accounts` tip is `bc3f87a` and contains the signup/crowd commits. Pages source still `cursor/accounts` `/`.
- Leftover: remote D1 migrate + Worker deploy happen separately.








