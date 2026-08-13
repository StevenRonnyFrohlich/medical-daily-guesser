# What is this (microscope)

A daily four-option identification game. Medical edition.

Three daily trays — human morphology, parasites & organisms, and abnormal morphology — of six fields each. Play any of them, or all three. Finish a tray and copy a Wordle-style result.

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
2. Settings → Pages → Deploy from branch → `master` or `main` → `/ (root)`.
3. The game will be at `https://stevenronnyfrohlich.github.io/medical-daily-guesser/`.

No server, no database, no build step. Streaks stay in each player's browser via `localStorage`.

If you later want a custom domain, point a CNAME at GitHub Pages. Still free.

Skip paid hosts (Vercel/Netlify/Render) until you need forms, accounts, or a real API. Cloudflare Pages is the free fallback if GitHub Pages ever gets in the way.

## Buy Me a Coffee

The top banner reads the slug in `js/config.js`:

```js
buyMeACoffee: "stevenronnyfrohlich"
```

Create that page at [buymeacoffee.com](https://www.buymeacoffee.com/) if it does not exist yet, or change the slug. Leave it as `""` to hide the banner.

## Catalog

87 specimens across parasitology, microbiology, hematology, and histology. Sources are public-domain or freely licensed teaching files (CDC PHIL / DPDx and Commons contributors). Each case links back to its Commons file.

This is a teaching game, not a diagnostic tool.
