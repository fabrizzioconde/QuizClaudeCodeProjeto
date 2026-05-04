export type Level = 'iniciante' | 'intermediario' | 'avancado'
export type GameMode = 'normal' | 'practice'
export type Category = 'fundamentos' | 'features' | 'boas-praticas'

export interface Question {
  id: string
  level: Level
  category: Category
  statement: string
  answer: boolean
  explanation: string
}

export interface AnswerRecord {
  questionId: string
  level: Level
  userAnswer: boolean
  isCorrect: boolean
  answeredAt: number
}

export interface LevelScores {
  iniciante: number
  intermediario: number
  avancado: number
}

export interface QuizSession {
  nickname: string
  email: string
  mode: GameMode
  currentLevel: Level
  questions: [Question[], Question[], Question[]]
  answers: AnswerRecord[]
  scores: LevelScores
  startedAt: number
  levelStartedAt: number
  attemptId: string | null
}

export interface LeaderboardEntry {
  id: string
  nickname: string
  total_score: number
  accuracy_pct: number
  score_iniciante: number
  score_intermediario: number
  score_avancado: number
  completed_at: string
}
