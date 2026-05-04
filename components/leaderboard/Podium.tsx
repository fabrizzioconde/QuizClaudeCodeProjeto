'use client'

import type { LeaderboardEntry } from '@/lib/types'

const MEDALS = ['🥇', '🥈', '🥉']
const HEIGHTS = ['h-20', 'h-14', 'h-10']
const ORDERS = [1, 0, 2] // visual order: 2nd, 1st, 3rd

interface PodiumProps {
  top3: LeaderboardEntry[]
  currentAttemptId: string | null
}

export function Podium({ top3, currentAttemptId }: PodiumProps) {
  if (top3.length === 0) return null

  return (
    <div className="flex items-end justify-center gap-2 mb-6">
      {ORDERS.map((rank) => {
        const entry = top3[rank]
        if (!entry) return <div key={rank} className="flex-1" />

        const isCurrentUser = entry.id === currentAttemptId
        const displayRank = rank + 1

        return (
          <div key={entry.id} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-2xl">{MEDALS[rank]}</span>
            <div
              className={`text-center ${
                isCurrentUser ? 'ring-2 ring-primary rounded-card p-1' : ''
              }`}
            >
              <div className="text-sm font-bold truncate max-w-[80px]">{entry.nickname}</div>
              <div className="text-xs text-gray-400">{entry.total_score.toLocaleString('pt-BR')} pts</div>
            </div>
            <div
              className={`w-full ${HEIGHTS[rank]} rounded-t-card flex items-center justify-center text-lg font-bold ${
                rank === 0
                  ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400'
                  : rank === 1
                  ? 'bg-gray-400/10 border border-gray-400/30 text-gray-400'
                  : 'bg-orange/10 border border-orange/30 text-orange'
              }`}
            >
              {displayRank}
            </div>
          </div>
        )
      })}
    </div>
  )
}
