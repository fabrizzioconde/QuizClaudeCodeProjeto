'use client'

import type { GameMode } from '@/lib/types'

interface TimerBarProps {
  totalSeconds: number
  remainingSeconds: number
  mode: GameMode
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function TimerBar({ totalSeconds, remainingSeconds, mode }: TimerBarProps) {
  if (mode === 'practice') return null

  const pct = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0
  const isRed = pct <= 20
  const isYellow = pct > 20 && pct <= 50

  const barColor = isRed
    ? 'bg-error'
    : isYellow
    ? 'bg-yellow-400'
    : 'bg-success'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor} ${isRed ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.max(0, pct)}%` }}
        />
      </div>
      <span
        className={`text-sm font-mono font-semibold min-w-[40px] text-right ${
          isRed ? 'text-error' : isYellow ? 'text-yellow-400' : 'text-success'
        }`}
      >
        {formatTime(Math.max(0, remainingSeconds))}
      </span>
    </div>
  )
}
