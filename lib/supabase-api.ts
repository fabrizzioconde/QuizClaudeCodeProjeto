import { getSupabase } from './supabase'
import type { QuizSession, AnswerRecord, LeaderboardEntry } from './types'
import { calculateTotalScore, calculateAccuracy } from './quiz-engine'

export async function submitAttempt(session: QuizSession): Promise<string> {
  const supabase = getSupabase()
  const totalScore = calculateTotalScore(session.scores)
  const accuracyPct = calculateAccuracy(session.answers)

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      nickname: session.nickname,
      email: session.email,
      mode: session.mode,
      score_iniciante: session.scores.iniciante,
      score_intermediario: session.scores.intermediario,
      score_avancado: session.scores.avancado,
      total_score: totalScore,
      accuracy_pct: accuracyPct,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data.id as string
}

export async function submitAnswers(
  attemptId: string,
  answers: AnswerRecord[]
): Promise<void> {
  const supabase = getSupabase()
  const rows = answers.map((a) => ({
    attempt_id: attemptId,
    question_id: a.questionId,
    level: a.level,
    user_answer: a.userAnswer,
    is_correct: a.isCorrect,
  }))

  const { error } = await supabase.from('quiz_answers').insert(rows)
  if (error) throw new Error(error.message)
}

export async function fetchLeaderboard(
  filter: 'all' | 'week' | 'month'
): Promise<LeaderboardEntry[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('quiz_attempts')
    .select('id, nickname, total_score, accuracy_pct, score_iniciante, score_intermediario, score_avancado, completed_at')
    .eq('mode', 'normal')
    .order('total_score', { ascending: false })
    .limit(100)

  if (filter === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    query = query.gte('completed_at', weekAgo)
  } else if (filter === 'month') {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    query = query.gte('completed_at', monthAgo)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as LeaderboardEntry[]
}
