'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuiz } from '@/context/QuizContext'
import { ScoreBreakdown } from '@/components/resultado/ScoreBreakdown'
import { ShareButton } from '@/components/resultado/ShareButton'
import { ReviewList } from '@/components/quiz/ReviewList'
import { submitAttempt, submitAnswers } from '@/lib/supabase-api'
import questionsData from '@/data/questions.json'
import type { Question } from '@/lib/types'

const allQuestions = questionsData.questions as Question[]

export default function ResultadoPage() {
  const router = useRouter()
  const { session, setAttemptId, resetSession } = useQuiz()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [showReview, setShowReview] = useState(false)

  // Guard redirect
  useEffect(() => {
    if (!session.nickname) {
      router.replace('/')
    }
  }, [session.nickname, router])

  // Submit to Supabase (Normal mode only, once)
  useEffect(() => {
    if (session.mode !== 'normal' || session.attemptId || !session.nickname) return

    setSaving(true)
    submitAttempt(session)
      .then((id) => {
        setAttemptId(id)
        return submitAnswers(id, session.answers)
      })
      .catch(() => setSaveError(true))
      .finally(() => setSaving(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!session.nickname) return null

  const answeredQuestionIds = session.answers.map((a) => a.questionId)
  const answeredQuestions = allQuestions.filter((q) =>
    answeredQuestionIds.includes(q.id)
  )

  function handlePlayAgain() {
    resetSession()
    router.push('/')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold">Resultado Final</h1>
          <p className="text-gray-500 text-sm">
            {session.nickname} •{' '}
            {session.mode === 'normal' ? 'Modo Normal' : 'Modo Prática'}
          </p>
          {saving && (
            <p className="text-xs text-primary mt-1 animate-pulse">Salvando resultado...</p>
          )}
          {saveError && (
            <p className="text-xs text-error mt-1">
              Não foi possível salvar no leaderboard. Seu resultado está correto.
            </p>
          )}
        </div>

        <ScoreBreakdown scores={session.scores} answers={session.answers} />

        <ShareButton session={session} />

        {/* Review toggle */}
        <button
          onClick={() => setShowReview((v) => !v)}
          className="w-full py-2.5 rounded-card border border-surface-alt text-sm text-gray-400 hover:border-primary hover:text-primary transition-colors"
        >
          {showReview ? '▲ Ocultar Respostas' : '📋 Revisar Todas as Respostas'}
        </button>

        {showReview && (
          <ReviewList questions={answeredQuestions} answers={session.answers} />
        )}

        <div className="flex gap-3">
          {session.mode === 'normal' && (
            <button
              onClick={() => router.push('/leaderboard')}
              className="flex-1 py-3 rounded-card-lg bg-surface border border-surface-alt font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              🏅 Ver Leaderboard
            </button>
          )}
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-3 rounded-card-lg bg-gradient-to-r from-primary-dark to-primary font-bold text-white hover:opacity-90 transition-opacity text-sm"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    </main>
  )
}
