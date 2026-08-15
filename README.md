# The Call

You're at the scope. Make the call.

Four daily trays — human morphology, parasites & organisms, abnormal morphology, and cytology — of six fields each. Play any of them, or all four. Finish a tray and copy a Wordle-style result.

These are the kinds of fields technologists, pathologists, and other medical professionals look at every day to save lives. Try your hand. See if you have what it takes.

This is practice, not a diagnostic tool. In the lab, the call can change a life. Here you look, then name what you see.

## Play

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

- Daily lobby: `index.html`
- Deep link a tray: `index.html?tray=cytology` (also `morphology`, `organisms`, `abnormal`)

Images load from [Wikimedia Commons](https://commons.wikimedia.org/). You need a network connection.

## Hosting (as cheap as it gets)

This is a static site. **GitHub Pages is free** for a public repo and is the right first host.

1. Push this repo to `StevenRonnyFrohlich/medical-daily-guesser`.
2. Settings → Pages → Deploy from branch → `cursor/medical-daily-guesser` → `/ (root)`.
3. Live site: [scopethecall.com](https://scopethecall.com/). GitHub Pages fallback: `https://stevenronnyfrohlich.github.io/medical-daily-guesser/`.

DNS is on Cloudflare. Apex and `www` are CNAME (flattened) to `stevenronnyfrohlich.github.io`, **DNS only** (grey cloud) so GitHub can issue HTTPS. Do not orange-cloud the records until GitHub shows the certificate as working, then use SSL mode **Full (strict)**.

No server, no database, no build step for the daily game. Streaks stay in each player's browser via `localStorage`.

Accounts and moderated uploads live on a **Cloudflare Worker** (`api.scopethecall.com` when DNS is attached). The GitHub Pages game stays on the apex. Do not orange-cloud `@` or `www`.

## Accounts (this branch)

Login is a magic link. People can submit fields; nothing is public until you approve it in `admin.html`.

Local:

```bash
cp .dev.vars.example .dev.vars
# set ADMIN_EMAIL to the inbox you will log in with
npm install
npm run db:local
npm run dev:api
```

In another terminal: `npx --yes serve .` then open `http://localhost:3000/account.html`. Without `RESEND_API_KEY`, the login page shows the magic link.

Remote (done on this account unless noted):

1. D1 `the-call` and R2 `the-call-fields` exist. Worker: `https://the-call-api.frobro.workers.dev` and **https://api.scopethecall.com**.
2. `catalogUrl` in `js/config.js` is `https://api.scopethecall.com`. Localhost still talks to `http://localhost:8787`.
3. Apex and `www` stay grey-cloud GitHub Pages. Do not switch Pages to `cursor/accounts` until you ask.
4. Still set production secrets: `npx wrangler secret put ADMIN_EMAIL` and `npx wrangler secret put RESEND_API_KEY`. Without Resend, magic links are not emailed. Without `ADMIN_EMAIL`, the review queue stays locked.

## Feedback

GitHub Pages cannot send mail. The site posts to [Formspree](https://formspree.io), which forwards the message to your inbox. Your address never appears on the page.

1. Create a free form at formspree.io and point it at the inbox you want.
2. Paste the endpoint into `js/config.js` as `feedbackForm` (looks like `https://formspree.io/f/xxxxabcd`).
3. Confirm the first real submission when Formspree emails you.

Until that URL is set, the Feedback button still opens, but send will say it is not connected yet. Do not put an email address in the HTML.

## About

`about.html` is a short developer page with a [LinkedIn](https://www.linkedin.com/in/steven-frohlich-80150746) link. The URL also lives in `js/config.js`.

## Catalog

107 specimens across parasitology, microbiology, hematology, histology, and cervical cytology. Sources are public-domain or freely licensed teaching files (CDC PHIL / DPDx and Commons contributors). Each case links back to its Commons file.

This is a teaching game, not a diagnostic tool.
