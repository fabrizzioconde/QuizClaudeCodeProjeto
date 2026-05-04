-- Quiz Claude Code — Supabase Setup
-- Executar no editor SQL do projeto Supabase

-- Tabela de tentativas
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  email text not null,
  mode text not null check (mode in ('normal', 'practice')),
  score_iniciante int not null default 0,
  score_intermediario int not null default 0,
  score_avancado int not null default 0,
  total_score int not null default 0,
  accuracy_pct float not null default 0,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Tabela de respostas individuais
create table quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references quiz_attempts(id) on delete cascade,
  question_id text not null,
  level text not null,
  user_answer boolean not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

-- Índices para performance
create index on quiz_attempts (total_score desc);
create index on quiz_attempts (completed_at desc);
create index on quiz_answers (attempt_id);

-- Row Level Security
alter table quiz_attempts enable row level security;
alter table quiz_answers enable row level security;

-- Policies
create policy "Public insert attempts" on quiz_attempts
  for insert to anon with check (true);

create policy "Public read attempts" on quiz_attempts
  for select to anon using (true);

create policy "Public insert answers" on quiz_answers
  for insert to anon with check (true);

-- Respostas individuais: somente leitura restrita (não expõe ao cliente)
create policy "Restricted read answers" on quiz_answers
  for select to anon using (false);
