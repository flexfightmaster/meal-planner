# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Meal Planner: a PWA that plans four weeks of meals for two people from their
calendars, calorie targets and a library of standardised recipes, with a weekly
shopping list, ingredient use-up, and a 20% eating-out allowance.

The design, decisions and status live in the xOS wiki, not here:
`..\wiki\projects\meal-planner\meal-planner-overview.md` and
`meal-planner-decisions.md`. Read those first. `..\wiki\household\eating-and-cooking-habits.md`
holds the household facts the planner rests on. The parent `..\CLAUDE.md` holds
the hub-wide conventions, including that every design change and learning gets
written back to the wiki.

## Commands

```bash
npm run dev        # dev server on http://localhost:5173/meal-planner/
npm run build      # tsc -b, then vite build to dist/
npm run preview    # serve dist/ to test the built PWA and service worker
npm run lint       # oxlint
npm run icons      # regenerate public/icon-*.png from scripts/make-icons.mjs
```

The dev server does not register the service worker; use `npm run preview` to test
install and offline behaviour. `npm run dev` needs `.env.local` (copy
`.env.example`); without it the app shows a "backend not configured" card.

## How it is built

- Vite 8, React 19, TypeScript. `vite-plugin-pwa` generates the manifest and
  service worker (`registerType: 'autoUpdate'`).
- `base` is `/meal-planner/` because the app is served at
  https://flexfightmaster.github.io/meal-planner/. Any absolute URL in
  `index.html` or `public/` must carry that prefix.
- Deploy is `.github/workflows/deploy.yml`: every push to `main` builds and
  publishes `dist/` to GitHub Pages. The two `VITE_SUPABASE_*` values are
  repository secrets.
- Backend is the shared `xos` Supabase project, Postgres schema `meals`
  (`src/supabase.ts` sets `db.schema`). Every table carries `household_id` with
  Row Level Security via `public.is_member()`, shared with money-map. SQL lives in
  `supabase/migrations/` and is applied by hand; keep files numbered and
  append-only.
- Auth is Google sign-in through Supabase with public sign-ups disabled; the same
  two accounts as money-map.
- Calendar ICS URLs are per-owner secrets and must be readable only by their
  owner. Recipe fetching, ICS fetching and reminders run in Edge Functions.
- `__BUILD_TIME__` is injected by `vite.config.ts` and shown in the UI.
- Icons are generated PNGs with no image library (`scripts/make-icons.mjs`).

## Rules

- No secret or ICS URL in this repo, ever. `.env*` is ignored.
- Recipe ingest keeps a review step; do not auto-save parsed recipes.
- No state library, router or ORM until the wiki decisions page says otherwise.

## Code map

- `src/supabase.ts`: client (or `null` when unconfigured).
- `src/useSession.ts`: session hook, Google sign-in, sign-out.
- `src/App.tsx`: Phase 0 shell: config state, sign-in, signed-in placeholder.

## Phase status

Phase 0 scaffold is built; it is done when both phones open the deployed app
signed in. Phase 1 (recipe library, URL ingest, ingredient mapping) is next; see
the wiki overview for the phase table.
