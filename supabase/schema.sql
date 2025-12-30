-- =====================================================
-- Habit Tracker - Supabase Database Schema
-- =====================================================
-- Execute este arquivo no SQL Editor do Supabase

-- =====================================================
-- 1. TABELAS
-- =====================================================

-- Tabela de perfis (estende auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text unique,
  whatsapp_enabled boolean default false,
  created_at timestamptz default now() not null
);

-- Tabela de hábitos
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly', 'custom')),
  target_per_week int default 7 check (target_per_week >= 1 and target_per_week <= 7),
  reminder_time time,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- Tabela de logs de hábitos
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  completed_at date not null default current_date,
  source text default 'web' check (source in ('web', 'whatsapp')),
  created_at timestamptz default now() not null,
  -- Garante que um hábito só pode ser marcado uma vez por dia
  unique(habit_id, completed_at)
);

-- =====================================================
-- 2. INDEXES
-- =====================================================

create index if not exists idx_habits_user_id on public.habits(user_id);
create index if not exists idx_habits_active on public.habits(is_active);
create index if not exists idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index if not exists idx_habit_logs_completed_at on public.habit_logs(completed_at);
create index if not exists idx_profiles_phone on public.profiles(phone);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilita RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- Policies para profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policies para habits
create policy "Users can view own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- Policies para habit_logs
create policy "Users can view own habit logs"
  on public.habit_logs for select
  using (
    habit_id in (
      select id from public.habits where user_id = auth.uid()
    )
  );

create policy "Users can insert own habit logs"
  on public.habit_logs for insert
  with check (
    habit_id in (
      select id from public.habits where user_id = auth.uid()
    )
  );

create policy "Users can delete own habit logs"
  on public.habit_logs for delete
  using (
    habit_id in (
      select id from public.habits where user_id = auth.uid()
    )
  );

-- =====================================================
-- 4. TRIGGERS
-- =====================================================

-- Função para criar profile automaticamente quando usuário se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que executa a função quando novo usuário é criado
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- 5. REALTIME
-- =====================================================

-- Habilita realtime para as tabelas
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_logs;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
