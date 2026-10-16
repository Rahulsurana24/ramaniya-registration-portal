create table if not exists public.daughter_registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text unique not null,
  full_name text not null,
  father_name text not null,
  phone_number text not null,
  city text not null,
  passport_photo_url text not null,
  payment_ref text not null,
  payment_screenshot_url text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.daughter_registrations enable row level security;
create policy "public registration insert" on public.daughter_registrations for insert to anon, authenticated with check (true);
create policy "admins read registrations" on public.daughter_registrations for select to authenticated using (true);
