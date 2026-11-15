-- Meal Planner: Phase 0 schema. Run in the Supabase SQL editor of the shared
-- `xos` project, then expose the `meals` schema under Project Settings > API >
-- Exposed schemas. Shares `public.household`, `public.member`, `public.is_member`
-- and `public.my_household` with money-map; this file creates them if the
-- money-map migration has not already.

create schema if not exists meals;

create table if not exists public.household (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.member (
  user_id uuid primary key references auth.users (id) on delete cascade,
  household_id uuid not null references public.household (id) on delete cascade,
  display_name text not null
);

alter table public.household enable row level security;
alter table public.member enable row level security;

create or replace function public.is_member(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.member where user_id = auth.uid() and household_id = h);
$$;

create or replace function public.my_household() returns uuid
language sql stable security definer set search_path = public as $$
  select household_id from public.member where user_id = auth.uid();
$$;

drop policy if exists household_read on public.household;
create policy household_read on public.household for select using (public.is_member(id));

drop policy if exists member_read on public.member;
create policy member_read on public.member for select using (public.is_member(household_id));

-- Phase 0 only needs one table so the lockdown can be tested end to end.
create table if not exists meals.recipe (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.household (id) on delete cascade default public.my_household(),
  title text not null,
  source_url text,
  servings integer,
  prep_minutes integer,
  cook_minutes integer,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table meals.recipe enable row level security;

drop policy if exists recipe_all on meals.recipe;
create policy recipe_all on meals.recipe
  for all using (public.is_member(household_id)) with check (public.is_member(household_id));

grant usage on schema meals to authenticated;
grant all on all tables in schema meals to authenticated;
alter default privileges in schema meals grant all on tables to authenticated;
