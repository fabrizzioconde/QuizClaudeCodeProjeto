# PRD — Quiz Claude Code

## 1. Visão Geral

Quiz web interativo de **Verdadeiro ou Falso** sobre Claude Code, desenvolvido para educação interna de times não-técnicos (PMs, líderes, people ops). O objetivo é aumentar o conhecimento sobre Claude Code de forma engajante, com mecânicas de gamificação (pontuação, timer, leaderboard) e revisão didática das respostas.

---

## 2. Objetivos de Negócio

- Aumentar o nível de conhecimento sobre Claude Code em times não-técnicos
- Gerar engajamento via competição saudável (leaderboard interno)
- Permitir ao RH/gestores acompanhar o progresso individual do time
- Oferecer uma experiência de aprendizado que o usuário possa repetir (perguntas aleatórias a cada rodada)

### Métricas de Sucesso

- Taxa de conclusão do quiz ≥ 70%
- Média de acerto crescente em tentativas repetidas (indicador de aprendizado)
- Participação de pelo menos 60% do time-alvo nos primeiros 30 dias

---

## 3. Público-Alvo

Perfil primário: profissionais **não-técnicos** — PMs, gestores, people ops, líderes de produto.
Perfil secundário: devs e tech leads que querem validar/aprofundar o conhecimento.

---

## 4. Modos de Jogo

| Modo | Timer | Leaderboard | Descrição |
|------|-------|-------------|-----------|
| **Normal** | ✅ Sim | ✅ Sim | Competitivo — timer por nível, resultado salvo no ranking |
| **Prática** | ❌ Não | ❌ Não | Educacional — sem pressão de tempo, foco em aprender |

---

## 5. Estrutura do Quiz

### 5.1 Níveis e Mecânica de Pontuação

| Nível | Perguntas/Rodada | Timer (Modo Normal) | Pts por Acerto | Máximo |
|-------|-----------------|---------------------|----------------|--------|
| Iniciante | 10 (aleatórias) | 5 minutos | 100 pts | 1.000 pts |
| Intermediário | 10 (aleatórias) | 4 minutos | 150 pts | 1.500 pts |
| Avançado | 10 (aleatórias) | 3 minutos | 200 pts | 2.000 pts |
| **Total** | **30** | — | — | **4.500 pts** |

- Perguntas são sorteadas aleatoriamente do pool JSON a cada rodada
- Se o timer global do nível expirar, o nível encerra com o score acumulado até aquele momento
- Modo Prática não salva no leaderboard

### 5.2 Categorias de Perguntas

1. **Fundamentos do Claude Code (CLI)** — o que é, como instala, como funciona, comandos básicos
2. **Features e Produtividade / Claude API/SDK** — funcionalidades avançadas, integrações, SDK
3. **Boas Práticas e Casos de Uso** — quando usar, quando não usar, estratégias de adoção, segurança

### 5.3 Pool de Perguntas

- **Volume:** 30–50 perguntas no total, distribuídas entre os 3 níveis e 3 categorias
- **Formato:** Verdadeiro ou Falso exclusivamente
- **Armazenamento:** arquivo JSON local no repositório (`/data/questions.json`)
- **Seleção:** 10 perguntas aleatórias por nível por rodada (sem repetição dentro da mesma rodada)

---

## 6. Fluxo do Usuário

```
Landing Page
  → Selecionar modo (Normal / Prática)
  → Preencher Nickname + E-mail
  → [Início do Quiz]
      → Nível: Iniciante (10 perguntas · timer 5min se modo Normal)
          → Tela de Revisão: Iniciante (score + explicações)
      → Nível: Intermediário (10 perguntas · timer 4min)
          → Tela de Revisão: Intermediário
      → Nível: Avançado (10 perguntas · timer 3min)
          → Tela de Revisão: Avançado
  → Tela de Resultado Final
      → Compartilhar Resultado
      → Revisar Todas as Respostas
      → Ver Leaderboard (apenas modo Normal)
```

---

## 7. Telas e Funcionalidades

### 7.1 Landing Page (`/`)

- Título e descrição do quiz
- Preview dos 3 níveis (badges)
- Seleção de modo: Normal ⚡ ou Prática 📚
- Formulário: campo **Nickname** + campo **E-mail**
- Botão "COMEÇAR QUIZ"

### 7.2 Tela do Quiz (`/quiz`)

- **Barra superior:** badge do nível atual + pontuação acumulada
- **Timer global** (somente modo Normal): barra de progresso com tempo restante
  - Verde: > 50% do tempo restante
  - Amarelo: 20–50%
  - Vermelho + pulso: < 20%
- **Barra de progresso:** dots indicando questões respondidas (verde = acerto, vermelho = erro, roxo = atual, cinza = pendente)
- **Pergunta:** tag de categoria + texto da afirmação
- **Botões de resposta:** `✓ Verdadeiro` e `✗ Falso`
- Ao responder: feedback visual imediato (verde/vermelho no botão), avança automaticamente após 1s

### 7.3 Tela de Revisão Pós-Nível

Exibida após cada nível ser concluído (ou timer expirar).

- Score do nível e número de acertos
- Lista de todas as perguntas do nível com:
  - Texto da afirmação
  - Resposta do usuário (com indicador visual correto/errado)
  - **Se errou:** resposta correta em destaque
  - Explicação didática em todos os casos
- Botão para avançar ao próximo nível (ou para resultado final no nível Avançado)

### 7.4 Tela de Resultado Final (`/resultado`)

- Score total em destaque
- Breakdown por nível: pontos + % de acerto
- Emoji/título baseado na performance (ex: 🏆 Especialista, 🎯 Avançado, 📚 Em Aprendizado)
- Ações:
  - **📤 Compartilhar Resultado** — gera texto formatado copiável para clipboard (ex: "Fiz o Quiz Claude Code e tirei 1.840 pts — 77% de acerto! 🏆")
  - **📋 Revisar Respostas** — expande seção inline na própria página de resultado com todas as 30 perguntas, respostas e explicações
  - **🏅 Ver Leaderboard** — navega para `/leaderboard` (apenas modo Normal)

### 7.5 Leaderboard (`/leaderboard`)

- Apenas tentativas do **Modo Normal**
- **Pódio visual** para os 3 primeiros (ouro, prata, bronze)
- **Lista rankeada** com: posição, nickname, score total, % acerto
- **Destaque do jogador atual** na lista ("← você")
- **Filtros de período:** Geral | Esta Semana | Este Mês
- Botão "Jogar Novamente" → volta para landing

---

## 8. Identidade Visual

- **Tema:** Dark mode exclusivo
- **Paleta principal:**
  - Background: `#0f0f13` / `#13131a`
  - Superfícies: `#1e1e2e` / `#2a2a3e`
  - Roxo (primário): `#a78bfa` / `#7c3aed`
  - Verde (acerto): `#4ade80` / `#22c55e`
  - Vermelho (erro): `#f87171` / `#ef4444`
  - Azul (intermediário): `#38bdf8`
  - Laranja (avançado): `#fb923c`
- **Tipografia:** Sistema (`Segoe UI`, `system-ui`, sans-serif)
- **Estilo:** Cards com border sutil, bordas arredondadas (`border-radius: 12–16px`), gradientes suaves nos elementos de destaque

---

## 9. Arquitetura Técnica

### 9.1 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) |
| Estilização | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) |
| Deploy | Vercel |
| Conteúdo | JSON local no repositório |

### 9.2 Estrutura de Rotas (App Router)

```
app/
  page.tsx              → Landing (/)
  quiz/
    page.tsx            → Sessão do quiz (/quiz)
  resultado/
    page.tsx            → Resultado final (/resultado)
  leaderboard/
    page.tsx            → Ranking (/leaderboard)
```

### 9.3 Estrutura de Arquivos

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                # Landing
│   ├── quiz/page.tsx
│   ├── resultado/page.tsx
│   └── leaderboard/page.tsx
├── components/
│   ├── quiz/
│   │   ├── QuestionCard.tsx
│   │   ├── TimerBar.tsx
│   │   ├── ProgressDots.tsx
│   │   ├── AnswerButtons.tsx
│   │   └── ReviewList.tsx
│   ├── resultado/
│   │   ├── ScoreBreakdown.tsx
│   │   └── ShareButton.tsx
│   └── leaderboard/
│       ├── Podium.tsx
│       └── RankingList.tsx
├── data/
│   └── questions.json          # Pool de perguntas
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── quiz-engine.ts          # Lógica de sorteio e scoring
│   └── types.ts                # TypeScript types
└── .env.local                  # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 9.4 Gerenciamento de Estado do Quiz

O estado da sessão de quiz é gerenciado via **React Context** (`QuizContext`) e persistido em `sessionStorage` para sobreviver a navegações internas:

```typescript
interface QuizSession {
  nickname: string
  email: string
  mode: 'normal' | 'practice'
  currentLevel: 'iniciante' | 'intermediario' | 'avancado'
  questions: Question[][]        // [iniciante[10], intermediario[10], avancado[10]]
  answers: AnswerRecord[]
  scores: { iniciante: number; intermediario: number; avancado: number }
  startedAt: number              // timestamp
}
```

---

## 10. Modelo de Dados (Supabase)

### Tabela: `quiz_attempts`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador único |
| `nickname` | `text` | Nome de exibição do jogador |
| `email` | `text` | Email para rastreamento |
| `mode` | `text` | `'normal'` ou `'practice'` |
| `score_iniciante` | `int` | Pontos no nível iniciante |
| `score_intermediario` | `int` | Pontos no nível intermediário |
| `score_avancado` | `int` | Pontos no nível avançado |
| `total_score` | `int` | Soma total dos pontos |
| `accuracy_pct` | `float` | % global de acertos (0–100) |
| `completed_at` | `timestamptz` | Quando o quiz foi finalizado |
| `created_at` | `timestamptz` | Default: `now()` |

### Tabela: `quiz_answers`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador único |
| `attempt_id` | `uuid` FK | Referência para `quiz_attempts.id` |
| `question_id` | `text` | ID da pergunta no JSON |
| `level` | `text` | `'iniciante'`, `'intermediario'`, `'avancado'` |
| `user_answer` | `boolean` | `true` = Verdadeiro, `false` = Falso |
| `is_correct` | `boolean` | Se a resposta foi correta |

### Políticas RLS (Row Level Security)

- `quiz_attempts`: INSERT público (anon) · SELECT público (para leaderboard)
- `quiz_answers`: INSERT público (anon) · SELECT restrito ao próprio `attempt_id`

---

## 11. Schema do JSON de Perguntas

Arquivo: `data/questions.json`

```json
{
  "questions": [
    {
      "id": "q_fund_001",
      "level": "iniciante",
      "category": "fundamentos",
      "statement": "Claude Code é uma ferramenta de linha de comando (CLI) desenvolvida pela Anthropic.",
      "answer": true,
      "explanation": "Correto. Claude Code é um CLI que permite interagir com o Claude diretamente pelo terminal, com capacidade de ler e editar arquivos, executar comandos e navegar em repositórios."
    },
    {
      "id": "q_fund_002",
      "level": "iniciante",
      "category": "fundamentos",
      "statement": "Claude Code pode ser instalado como uma extensão do VS Code diretamente pela marketplace da Microsoft.",
      "answer": false,
      "explanation": "Falso. Claude Code é instalado via npm (`npm install -g @anthropic-ai/claude-code`). Ele tem integração com VS Code, mas não é distribuído pela marketplace da Microsoft."
    }
  ]
}
```

### Campos obrigatórios por pergunta

| Campo | Tipo | Valores |
|-------|------|---------|
| `id` | `string` | Único, formato `q_{categoria}_{número}` |
| `level` | `string` | `"iniciante"`, `"intermediario"`, `"avancado"` |
| `category` | `string` | `"fundamentos"`, `"features"`, `"boas-praticas"` |
| `statement` | `string` | A afirmação a ser julgada (V ou F) |
| `answer` | `boolean` | `true` = Verdadeiro, `false` = Falso |
| `explanation` | `string` | Explicação didática exibida na revisão |

### Distribuição recomendada do pool

| Nível | Quantidade | Por categoria |
|-------|-----------|---------------|
| Iniciante | 15–18 | ~5–6 por categoria |
| Intermediário | 10–15 | ~3–5 por categoria |
| Avançado | 8–12 | ~3–4 por categoria |

---

## 12. Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

---

## 13. Deploy

### Vercel
- Conectar repositório GitHub ao Vercel
- Configurar variáveis de ambiente no painel do Vercel
- Branch `main` → produção automática

### Supabase
- Criar projeto no Supabase
- Executar migrations SQL para criar as tabelas `quiz_attempts` e `quiz_answers`
- Habilitar RLS e aplicar as políticas descritas na seção 10
- Copiar URL e anon key para o `.env.local`

---

## 14. Fora do Escopo (v1)

- Autenticação / login de usuários
- Admin panel para gerenciar perguntas via interface
- Modo multiplayer / tempo real
- Notificações por e-mail
- Internacionalização (i18n)
- PWA / app mobile nativo
- Analytics avançado (Mixpanel, Amplitude etc.)
