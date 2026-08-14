create table if not exists public.guestbook (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  handle text,
  message text not null,
  likes integer default 0
);

alter table public.guestbook enable row level security;

drop policy if exists "Cualquiera puede ver los mensajes" on public.guestbook;
create policy "Cualquiera puede ver los mensajes" on public.guestbook for select using (true);

drop policy if exists "Cualquiera puede publicar un mensaje" on public.guestbook;
create policy "Cualquiera puede publicar un mensaje" on public.guestbook for insert with check (true);

drop policy if exists "Cualquiera puede dar like" on public.guestbook;
create policy "Cualquiera puede dar like" on public.guestbook for update using (true);