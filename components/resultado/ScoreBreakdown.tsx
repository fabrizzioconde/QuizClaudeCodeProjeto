'use client'

import type { LevelScores, AnswerRecord, Level } from '@/lib/types'
import { calculateAccuracy, getPerformanceTitle, calculateTotalScore } from '@/lib/quiz-engine'

interface LevelInfo {
  level: Level
  label: string
  max: number
  color: string
}

const LEVELS: LevelInfo[] = [
  { level: 'iniciante', label: 'Iniciante', max: 1000, color: 'text-primary' },
  { level: 'intermediario', label: 'Intermediário', max: 1500, color: 'text-blue' },
  { level: 'avancado', label: 'Avançado', max: 2000, color: 'text-orange' },
]

interface ScoreBreakdownProps {
  scores: LevelScores
  answers: AnswerRecord[]
}

export function ScoreBreakdown({ scores, answers }: ScoreBreakdownProps) {
  const total = calculateTotalScore(scores)
  const accuracy = calculateAccuracy(answers)
  const title = getPerformanceTitle(total)

  return (
    <div className="space-y-4">
      {/* Total Score */}
      <div className="text-center py-6 bg-surface rounded-card-lg border border-surface-alt">
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue mb-1">
          {total.toLocaleString('pt-BR')}
        </div>
        <div className="text-gray-400 text-sm">pontos totais</div>
        <div className="mt-3 text-xl font-semibold">{title}</div>
        <div className="text-gray-400 text-sm mt-1">{accuracy}% de acerto</div>
      </div>

      {/* Level Breakdown */}
      <div className="space-y-2">
        {LEVELS.map(({ level, label, max, color }) => {
          const levelAnswers = answers.filter((a) => a.level === level)
          const levelAccuracy = calculateAccuracy(levelAnswers)
          const score = scores[level]
          const pct = max > 0 ? (score / max) * 100 : 0

          return (
            <div
              key={level}
              className="bg-surface rounded-card border border-surface-alt p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold text-sm ${color}`}>{label}</span>
                <span className="text-sm">
                  <span className="font-bold">{score.toLocaleString('pt-BR')}</span>
                  <span className="text-gray-500"> / {max.toLocaleString('pt-BR')} pts</span>
                </span>
              </div>
              <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-blue"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">{levelAccuracy}% de acerto</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
