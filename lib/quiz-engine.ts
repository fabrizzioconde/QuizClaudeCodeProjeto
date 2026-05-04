import type { Question, AnswerRecord, Level, LevelScores, QuizSession } from './types'
import questionsData from '@/data/questions.json'

const POINTS_PER_LEVEL: Record<Level, number> = {
  iniciante: 100,
  intermediario: 150,
  avancado: 200,
}

const QUESTIONS_PER_LEVEL = 10

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function selectQuestionsForSession(): [Question[], Question[], Question[]] {
  const all = questionsData.questions as Question[]

  const byLevel = (level: Level) => {
    const filtered = all.filter((q) => q.level === level)
    if (filtered.length < QUESTIONS_PER_LEVEL) {
      console.error(
        `[quiz-engine] Pool insuficiente para nível "${level}": ${filtered.length} perguntas (mínimo ${QUESTIONS_PER_LEVEL})`
      )
    }
    return shuffle(filtered).slice(0, QUESTIONS_PER_LEVEL)
  }

  return [byLevel('iniciante'), byLevel('intermediario'), byLevel('avancado')]
}

export function calculateLevelScore(answers: AnswerRecord[], level: Level): number {
  return answers
    .filter((a) => a.level === level && a.isCorrect)
    .reduce((sum) => sum + POINTS_PER_LEVEL[level], 0)
}

export function calculateTotalScore(scores: LevelScores): number {
  return scores.iniciante + scores.intermediario + scores.avancado
}

export function calculateAccuracy(answers: AnswerRecord[]): number {
  if (answers.length === 0) return 0
  const correct = answers.filter((a) => a.isCorrect).length
  return Math.round((correct / answers.length) * 1000) / 10
}

export function getPerformanceTitle(totalScore: number, maxScore = 4500): string {
  const pct = (totalScore / maxScore) * 100
  if (pct >= 80) return '🏆 Especialista'
  if (pct >= 60) return '🎯 Avançado'
  if (pct >= 40) return '📈 Intermediário'
  return '📚 Em Aprendizado'
}

export function formatScoreForShare(session: QuizSession): string {
  const total = calculateTotalScore(session.scores)
  const accuracy = calculateAccuracy(session.answers)
  const title = getPerformanceTitle(total)
  return `Fiz o Quiz Claude Code e tirei ${total.toLocaleString('pt-BR')} pts — ${accuracy}% de acerto! ${title.split(' ')[0]}`
}
