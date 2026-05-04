'use client'

import type { AnswerRecord } from '@/lib/types'

interface ProgressDotsProps {
  total: number
  answers: AnswerRecord[]
  currentIndex: number
}

export function ProgressDots({ total, answers, currentIndex }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const answered = answers[i]
        const isActive = i === currentIndex

        let dotClass = 'w-3 h-3 rounded-full transition-all duration-200 '

        if (answered) {
          dotClass += answered.isCorrect ? 'bg-success' : 'bg-error'
        } else if (isActive) {
          dotClass += 'bg-primary ring-2 ring-primary/50 scale-110'
        } else {
          dotClass += 'bg-surface-alt'
        }

        return <div key={i} className={dotClass} />
      })}
    </div>
  )
}
