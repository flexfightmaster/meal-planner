# Meal Planner

Four-week meal plans from our calendars, calorie targets and the recipes we like,
with a shopping list and a 20% eating-out allowance.

Live: https://flexfightmaster.github.io/meal-planner/ (once the repo is pushed and
Pages is enabled)

Open that link in Chrome on your phone and choose **Install app** from the menu to
put it on the home screen.

## Develop

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase URL and anon key
npm run dev
```

Pushing to `main` deploys to GitHub Pages automatically. The two `VITE_SUPABASE_*`
values must be set as repository secrets for the build.

## Backend

Shared `xos` Supabase project, schema `meals`. The SQL in `supabase/migrations/`
is run by hand in the Supabase SQL editor. Design and status live in the xOS wiki:
`..\wiki\projects\meal-planner\`.
