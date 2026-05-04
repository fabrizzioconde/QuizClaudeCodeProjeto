'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { QuizSession, GameMode, Level, AnswerRecord } from '@/lib/types'
import { selectQuestionsForSession } from '@/lib/quiz-engine'

const SESSION_KEY = 'quiz_session'

const LEVEL_ORDER: Level[] = ['iniciante', 'intermediario', 'avancado']

const EMPTY_SESSION: QuizSession = {
  nickname: '',
  email: '',
  mode: 'normal',
  currentLevel: 'iniciante',
  questions: [[], [], []],
  answers: [],
  scores: { iniciante: 0, intermediario: 0, avancado: 0 },
  startedAt: 0,
  levelStartedAt: 0,
  attemptId: null,
}

interface QuizContextValue {
  session: QuizSession
  startSession: (nickname: string, email: string, mode: GameMode) => void
  recordAnswer: (questionId: string, userAnswer: boolean) => void
  completeLevel: (level: Level, levelScore: number) => void
  setAttemptId: (id: string) => void
  resetSession: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<QuizSession>(EMPTY_SESSION)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage on mount (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        try {
          setSession(JSON.parse(stored))
        } catch {
          sessionStorage.removeItem(SESSION_KEY)
        }
      }
    }
    setHydrated(true)
  }, [])

  // Persist to sessionStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return
    if (typeof window !== 'undefined') {
      if (session.nickname) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      }
    }
  }, [session, hydrated])

  const startSession = useCallback((nickname: string, email: string, mode: GameMode) => {
    const questions = selectQuestionsForSession()
    const now = Date.now()
    setSession({
      nickname,
      email,
      mode,
      currentLevel: 'iniciante',
      questions,
      answers: [],
      scores: { iniciante: 0, intermediario: 0, avancado: 0 },
      startedAt: now,
      levelStartedAt: now,
      attemptId: null,
    })
  }, [])

  const recordAnswer = useCallback((questionId: string, userAnswer: boolean) => {
    setSession((prev) => {
      const levelQuestions =
        prev.questions[LEVEL_ORDER.indexOf(prev.currentLevel)]
      const question = levelQuestions.find((q) => q.id === questionId)
      if (!question) return prev
      const isCorrect = question.answer === userAnswer
      const record: AnswerRecord = {
        questionId,
        level: prev.currentLevel,
        userAnswer,
        isCorrect,
        answeredAt: Date.now(),
      }
      return { ...prev, answers: [...prev.answers, record] }
    })
  }, [])

  const completeLevel = useCallback((level: Level, levelScore: number) => {
    setSession((prev) => {
      const currentIdx = LEVEL_ORDER.indexOf(level)
      const nextLevel = LEVEL_ORDER[currentIdx + 1] ?? level
      return {
        ...prev,
        scores: { ...prev.scores, [level]: levelScore },
        currentLevel: nextLevel,
        levelStartedAt: Date.now(),
      }
    })
  }, [])

  const setAttemptId = useCallback((id: string) => {
    setSession((prev) => ({ ...prev, attemptId: id }))
  }, [])

  const resetSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY)
    }
    setSession(EMPTY_SESSION)
  }, [])

  return (
    <QuizContext.Provider
      value={{ session, startSession, recordAnswer, completeLevel, setAttemptId, resetSession }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
