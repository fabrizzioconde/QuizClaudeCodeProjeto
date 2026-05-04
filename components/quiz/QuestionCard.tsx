'use client'

import type { Question } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  fundamentos: 'Fundamentos',
  features: 'Features & SDK',
  'boas-praticas': 'Boas Práticas',
}

const CATEGORY_COLORS: Record<string, string> = {
  fundamentos: 'bg-primary/20 text-primary',
  features: 'bg-blue/20 text-blue',
  'boas-praticas': 'bg-success/20 text-success',
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
}

export function QuestionCard({ question, questionNumber, totalQuestions }: QuestionCardProps) {
  return (
    <div className="bg-surface border border-surface-alt rounded-card-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            CATEGORY_COLORS[question.category] ?? 'bg-surface-alt text-gray-400'
          }`}
        >
          {CATEGORY_LABELS[question.category] ?? question.category}
        </span>
        <span className="text-xs text-gray-500">
          {questionNumber} / {totalQuestions}
        </span>
      </div>
      <p className="text-base leading-relaxed text-center font-medium">{question.statement}</p>
    </div>
  )
}
