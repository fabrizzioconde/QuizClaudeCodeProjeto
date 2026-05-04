'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQuiz } from '@/context/QuizContext'
import { TimerBar } from '@/components/quiz/TimerBar'
import { ProgressDots } from '@/components/quiz/ProgressDots'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { AnswerButtons } from '@/components/quiz/AnswerButtons'
import { ReviewList } from '@/components/quiz/ReviewList'
import type { Level, Question } from '@/lib/types'

const LEVEL_DURATIONS: Record<Level, number> = {
  iniciante: 300,
  intermediario: 240,
  avancado: 180,
}

const LEVEL_ORDER: Level[] = ['iniciante', 'intermediario', 'avancado']

const LEVEL_LABELS: Record<Level, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

const LEVEL_COLORS: Record<Level, string> = {
  iniciante: 'text-primary bg-primary/10',
  intermediario: 'text-blue bg-blue/10',
  avancado: 'text-orange bg-orange/10',
}

type FeedbackState = 'none' | 'correct' | 'incorrect'

export default function QuizPage() {
  const router = useRouter()
  const { session, recordAnswer, completeLevel } = useQuiz()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('none')
  const [lastUserAnswer, setLastUserAnswer] = useState<boolean | undefined>(undefined)
  const [showReview, setShowReview] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Ref keeps handleTimeExpired fresh inside the setInterval callback
  const handleTimeExpiredRef = useRef<() => void>(() => {})

  const currentLevel = session.currentLevel
  const levelIndex = LEVEL_ORDER.indexOf(currentLevel)
  const levelQuestions: Question[] = session.questions[levelIndex] ?? []
  const levelAnswers = session.answers.filter((a) => a.level === currentLevel)
  const currentQuestion = levelQuestions[questionIndex]

  const totalDuration = LEVEL_DURATIONS[currentLevel]

  // Guard redirect
  useEffect(() => {
    if (!session.nickname) {
      router.replace('/')
    }
  }, [session.nickname, router])

  // Init remaining seconds when level changes
  useEffect(() => {
    if (!session.levelStartedAt || session.mode === 'practice') return
    const elapsed = Math.floor((Date.now() - session.levelStartedAt) / 1000)
    setRemainingSeconds(Math.max(0, totalDuration - elapsed))
  }, [currentLevel, session.levelStartedAt, session.mode, totalDuration])

  // Timer countdown
  useEffect(() => {
    if (session.mode === 'practice' || showReview) return

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleTimeExpiredRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, showReview, session.mode])

  const handleTimeExpired = useCallback(() => {
    const levelAnswersNow = session.answers.filter((a) => a.level === currentLevel)
    const pts = currentLevel === 'iniciante' ? 100 : currentLevel === 'intermediario' ? 150 : 200
    const score = levelAnswersNow.filter((a) => a.isCorrect).length * pts
    completeLevel(currentLevel, score)
    setShowReview(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, session.answers])

  // Keep ref in sync so the setInterval callback always calls the latest version
  useEffect(() => {
    handleTimeExpiredRef.current = handleTimeExpired
  }, [handleTimeExpired])

  function handleAnswer(userAnswer: boolean) {
    if (!currentQuestion || feedbackState !== 'none') return

    const isCorrect = currentQuestion.answer === userAnswer
    recordAnswer(currentQuestion.id, userAnswer)
    setLastUserAnswer(userAnswer)
    setFeedbackState(isCorrect ? 'correct' : 'incorrect')

    feedbackTimeout.current = setTimeout(() => {
      setFeedbackState('none')
      setLastUserAnswer(undefined)

      const nextIndex = questionIndex + 1
      if (nextIndex >= levelQuestions.length) {
        // Level complete
        if (timerRef.current) clearInterval(timerRef.current)
        const finalScore = [...session.answers.filter((a) => a.level === currentLevel), {
          questionId: currentQuestion.id,
          level: currentLevel,
          userAnswer,
          isCorrect,
          answeredAt: Date.now(),
        }].filter((a) => a.isCorrect).length * (
          currentLevel === 'iniciante' ? 100 : currentLevel === 'intermediario' ? 150 : 200
        )
        completeLevel(currentLevel, finalScore)
        setShowReview(true)
      } else {
        setQuestionIndex(nextIndex)
      }
    }, 1000)
  }

  function handleNextLevel() {
    setShowReview(false)
    setQuestionIndex(0)
    setFeedbackState('none')

    const nextLevelIdx = levelIndex + 1
    if (nextLevelIdx >= LEVEL_ORDER.length) {
      router.push('/resultado')
    }
  }

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    }
  }, [])

  if (!session.nickname) return null

  const isLastLevel = levelIndex === LEVEL_ORDER.length - 1
  const nextLevelLabel = !isLastLevel ? LEVEL_LABELS[LEVEL_ORDER[levelIndex + 1]] : null

  // Compute score for current level for review
  const currentLevelScore = session.answers
    .filter((a) => a.level === currentLevel && a.isCorrect)
    .length * (currentLevel === 'iniciante' ? 100 : currentLevel === 'intermediario' ? 150 : 200)

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-6">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${LEVEL_COLORS[currentLevel]}`}
          >
            {LEVEL_LABELS[currentLevel]}
          </span>
          <span className="text-sm text-gray-400">
            {session.scores.iniciante + session.scores.intermediario + session.scores.avancado + currentLevelScore}{' '}
            <span className="text-gray-600">pts acumulados</span>
          </span>
        </div>

        {/* Timer */}
        {session.mode === 'normal' && !showReview && (
          <TimerBar
            totalSeconds={totalDuration}
            remainingSeconds={remainingSeconds}
            mode={session.mode}
          />
        )}

        {showReview ? (
          /* Review Screen */
          <div className="space-y-4">
            <div className="bg-surface border border-surface-alt rounded-card-lg p-5 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {currentLevelScore.toLocaleString('pt-BR')} pts
              </div>
              <div className="text-gray-400 text-sm">
                {levelAnswers.filter((a) => a.isCorrect).length}/{levelQuestions.length} acertos —{' '}
                {LEVEL_LABELS[currentLevel]}
              </div>
            </div>

            <ReviewList questions={levelQuestions} answers={levelAnswers} />

            <button
              onClick={handleNextLevel}
              className="w-full py-3 rounded-card-lg bg-gradient-to-r from-primary-dark to-primary font-bold text-white hover:opacity-90 transition-opacity"
            >
              {isLastLevel ? 'Ver Resultado Final' : `Próximo Nível: ${nextLevelLabel} →`}
            </button>
          </div>
        ) : (
          /* Quiz Screen */
          <div className="space-y-4">
            <ProgressDots
              total={levelQuestions.length}
              answers={levelAnswers}
              currentIndex={questionIndex}
            />

            {currentQuestion ? (
              <>
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={questionIndex + 1}
                  totalQuestions={levelQuestions.length}
                />
                <AnswerButtons
                  onAnswer={handleAnswer}
                  disabled={feedbackState !== 'none'}
                  feedbackState={feedbackState}
                  correctAnswer={currentQuestion.answer}
                  userAnswer={lastUserAnswer}
                />
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">Carregando...</div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
