-- Run this whole file in Supabase: Project > SQL Editor > New query > paste > Run

create table if not exists professionals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  category text not null,
  city text not null,
  hourly_rate numeric not null,
  experience_years integer default 0,
  bio text,
  created_at timestamp with time zone default now()
);

create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  professional_id uuid references professionals(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  date date not null,
  hours_needed integer not null,
  address text not null,
  notes text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table professionals enable row level security;
alter table bookings enable row level security;

-- This is a class project with no login system, so we allow public read/insert.
-- (Documented as a known limitation in the README.)
create policy "Public can read professionals"
  on professionals for select
  using (true);

create policy "Public can register as professional"
  on professionals for insert
  with check (true);

create policy "Public can read bookings"
  on bookings for select
  using (true);

create policy "Public can create bookings"
  on bookings for insert
  with check (true);
