'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuiz } from '@/context/QuizContext'
import { Podium } from '@/components/leaderboard/Podium'
import { RankingList } from '@/components/leaderboard/RankingList'
import { fetchLeaderboard } from '@/lib/supabase-api'
import type { LeaderboardEntry } from '@/lib/types'

type Filter = 'all' | 'week' | 'month'

const FILTER_LABELS: Record<Filter, string> = {
  all: 'Geral',
  week: 'Esta Semana',
  month: 'Este Mês',
}

export default function LeaderboardPage() {
  const router = useRouter()
  const { session, resetSession } = useQuiz()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetchLeaderboard(filter)
      .then(setEntries)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [filter])

  function handlePlayAgain() {
    resetSession()
    router.push('/')
  }

  const top3 = entries.slice(0, 3)

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg space-y-4">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold">🏅 Leaderboard</h1>
          <p className="text-gray-500 text-sm">Modo Normal — melhores pontuações</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-card bg-surface border border-surface-alt p-1 gap-1">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-sm rounded font-medium transition-all ${
                filter === f
                  ? 'bg-primary text-bg font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse">
            Carregando ranking...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-error text-sm">
            Erro ao carregar o leaderboard. Verifique sua conexão.
          </div>
        ) : (
          <>
            <Podium top3={top3} currentAttemptId={session.attemptId} />
            <RankingList entries={entries} currentAttemptId={session.attemptId} />
          </>
        )}

        <button
          onClick={handlePlayAgain}
          className="w-full py-3 rounded-card-lg bg-gradient-to-r from-primary-dark to-primary font-bold text-white hover:opacity-90 transition-opacity"
        >
          Jogar Novamente
        </button>
      </div>
    </main>
  )
}
