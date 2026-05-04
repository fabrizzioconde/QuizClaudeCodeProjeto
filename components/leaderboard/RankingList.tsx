'use client'

import type { LeaderboardEntry } from '@/lib/types'

interface RankingListProps {
  entries: LeaderboardEntry[]
  currentAttemptId: string | null
}

export function RankingList({ entries, currentAttemptId }: RankingListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma tentativa registrada ainda.
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {entries.map((entry, idx) => {
        const isCurrentUser = entry.id === currentAttemptId
        const rank = idx + 1

        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-card transition-colors ${
              isCurrentUser
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-surface border border-transparent hover:border-surface-alt'
            }`}
          >
            <span
              className={`w-8 text-center text-sm font-bold flex-shrink-0 ${
                rank === 1
                  ? 'text-yellow-400'
                  : rank === 2
                  ? 'text-gray-400'
                  : rank === 3
                  ? 'text-orange'
                  : 'text-gray-600'
              }`}
            >
              {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
            </span>

            <span className="flex-1 font-medium truncate">
              {entry.nickname}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-primary font-normal">← você</span>
              )}
            </span>

            <span className="text-sm font-bold text-right">
              {entry.total_score.toLocaleString('pt-BR')}
              <span className="text-gray-500 font-normal"> pts</span>
            </span>

            <span className="text-xs text-gray-500 min-w-[40px] text-right hidden sm:block">
              {entry.accuracy_pct}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
