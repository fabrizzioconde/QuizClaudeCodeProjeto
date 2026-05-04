# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is in the **implementation phase** — the full spec is in `prd.md` (Portuguese). UI mockups live in `.superpowers/`. No source code exists yet.

## Stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS
- **Supabase** (PostgreSQL + Row Level Security) for leaderboard persistence
- **Vercel** for deployment

## Commands

```bash
npm run dev      # Development server at localhost:3000
npm run build    # Production build (ESLint skipped during build — v9 incompatível com Next.js 14)
npm start        # Start production server
```

> **Nota:** ESLint 9 foi instalado (incompatível com `eslint-config-next` do Next.js 14). O build ignora lint (`ignoreDuringBuilds: true` em `next.config.js`). Para rodar lint manualmente: `npx eslint .`

## Architecture

### Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Landing — mode selection (Normal/Prática), nickname + email input |
| `/quiz` | Quiz session — 3 progressive levels |
| `/resultado` | Final score breakdown + share button |
| `/leaderboard` | Ranked Normal-mode attempts |

### State Model

Quiz session state is managed by a `QuizContext` (React Context) and persisted to `sessionStorage` across navigations. State includes: user info, current level, selected questions, submitted answers, per-level scores, and timer values.

### Data Flow

1. **Questions** — loaded from `data/questions.json` at quiz start; 10 random questions selected per level (no repetition within a session).
2. **Scoring** — computed client-side: 100 pts/correct (Iniciante), 150 pts (Intermediário), 200 pts (Avançado). Max 4,500 pts total.
3. **Submission** — only Normal-mode attempts are saved to Supabase (`quiz_attempts` + `quiz_answers` tables with FK relationship).

### Supabase Schema

```sql
quiz_attempts (id, nickname, email, mode, score_iniciante, score_intermediario, score_avancado, total_score, accuracy_pct, created_at)
quiz_answers  (id, attempt_id FK, question_id, user_answer, is_correct, level, created_at)
```

RLS: public insert on `quiz_attempts`; public read for leaderboard; restricted read on `quiz_answers`.

### Key lib/ Modules

- `lib/supabase.ts` — Supabase client (uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `lib/quiz-engine.ts` — random question selection and score calculation
- `lib/types.ts` — shared TypeScript interfaces

### Question Schema (`data/questions.json`)

```ts
{ id: string, level: "iniciante"|"intermediario"|"avancado", category: "Fundamentos"|"Features"|"Boas-Práticas", statement: string, answer: boolean, explanation: string }
```

### Visual Theme (Tailwind)

Dark mode only. Custom palette:
- Background: `#0f0f13` / `#13131a`
- Primary (purple): `#a78bfa` / `#7c3aed`
- Success: `#4ade80` / `#22c55e`
- Error: `#f87171` / `#ef4444`

### Game Modes

- **Normal** — timed per level (Iniciante 5 min, Intermediário 4 min, Avançado 3 min), results saved to leaderboard
- **Prática** — untimed, educational; results NOT saved

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
