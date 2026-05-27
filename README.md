# Westies Pub Golf

A GitHub-ready realtime pub golf scorecard. Teams enter a team name, track strokes, penalties, water hazards, and chunders, and the caddy/admin view shows a live leaderboard.

## What it does

- Static site, so it can run on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any public web host.
- Supabase Realtime/Postgres sync for live public games.
- Local preview mode when Supabase is not configured.
- Fixed game room for Westies Pub Golf, so players do not need a game code.
- Admin clubhouse view protected by a simple caddy password in `config.js`, with remove-player controls.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

Without Supabase details, scores are stored in your browser only.

## Supabase setup

1. Create a free Supabase project at `https://supabase.com`.
2. Open the SQL editor and run `supabase-schema.sql`.
3. In Supabase, go to **Project Settings → API** and copy:
   - Project URL
   - anon public key
4. Copy `config.example.js` to `config.js` and fill in:

```js
window.PUB_GOLF_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  adminPassword: "change-this"
};
```

The anon key is designed to be public in browser apps. The SQL policies make the event game intentionally public.

## GitHub Pages deploy

1. Put these files in a GitHub repository.
2. Commit a configured `config.js` for the live deployment, or generate it during your Pages build.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch** and select your main branch.
5. Share the Pages URL with players.

## Admin login

Type the `adminPassword` from `config.js`, then choose **Caddy Login**. The current default is `Westies1`.

## Course editing

Edit the `holes` array in `app.js` to change pub names, pars, and rules.
