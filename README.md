# The Call

You're at the scope. Make the call.

Three daily trays — human morphology, parasites & organisms, and abnormal morphology — of six fields each. Play any of them, or all three. Finish a tray and copy a Wordle-style result.

These are the kinds of fields technologists, pathologists, and other medical professionals look at every day to save lives. Try your hand. See if you have what it takes.

This is practice, not a diagnostic tool. In the lab, the call can change a life. Here you look, then name what you see.

## Play

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

- Daily lobby: `index.html`
- Deep link a tray: `index.html?tray=abnormal`
- Practice a track: `index.html?tray=organisms&mode=lab`

Images load from [Wikimedia Commons](https://commons.wikimedia.org/). You need a network connection.

## Hosting (as cheap as it gets)

This is a static site. **GitHub Pages is free** for a public repo and is the right first host.

1. Push this repo to `StevenRonnyFrohlich/medical-daily-guesser`.
2. Settings → Pages → Deploy from branch → `cursor/medical-daily-guesser` → `/ (root)`.
3. Live site: [scopethecall.com](https://scopethecall.com/). GitHub Pages fallback: `https://stevenronnyfrohlich.github.io/medical-daily-guesser/`.

DNS is on Cloudflare. Apex and `www` are CNAME (flattened) to `stevenronnyfrohlich.github.io`, **DNS only** (grey cloud) so GitHub can issue HTTPS. Do not orange-cloud the records until GitHub shows the certificate as working, then use SSL mode **Full (strict)**.

No server, no database, no build step. Streaks stay in each player's browser via `localStorage`.

Skip paid hosts (Vercel/Netlify/Render) until you need forms, accounts, or a real API. Cloudflare Pages is the free fallback if GitHub Pages ever gets in the way.

## About

`about.html` is a short developer page with a [LinkedIn](https://www.linkedin.com/in/steven-frohlich-80150746) link. The URL also lives in `js/config.js`.

## Catalog

87 specimens across parasitology, microbiology, hematology, and histology. Sources are public-domain or freely licensed teaching files (CDC PHIL / DPDx and Commons contributors). Each case links back to its Commons file.

This is a teaching game, not a diagnostic tool.
