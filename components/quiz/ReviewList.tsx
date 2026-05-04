'use client'

import type { Question, AnswerRecord } from '@/lib/types'

interface ReviewListProps {
  questions: Question[]
  answers: AnswerRecord[]
}

export function ReviewList({ questions, answers }: ReviewListProps) {
  return (
    <div className="space-y-3">
      {questions.map((question, i) => {
        const answer = answers.find((a) => a.questionId === question.id)
        const isCorrect = answer?.isCorrect ?? false
        const userAnswer = answer?.userAnswer

        return (
          <div
            key={question.id}
            className={`rounded-card border p-4 ${
              isCorrect
                ? 'border-success/30 bg-success/5'
                : 'border-error/30 bg-error/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCorrect
                    ? 'bg-success/20 text-success'
                    : 'bg-error/20 text-error'
                }`}
              >
                {isCorrect ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{question.statement}</p>

                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  <span className="text-gray-400">
                    Sua resposta:{' '}
                    <span className={isCorrect ? 'text-success' : 'text-error'}>
                      {userAnswer === undefined ? '—' : userAnswer ? 'Verdadeiro' : 'Falso'}
                    </span>
                  </span>
                  {!isCorrect && (
                    <span className="text-gray-400">
                      Correto:{' '}
                      <span className="text-success">
                        {question.answer ? 'Verdadeiro' : 'Falso'}
                      </span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed bg-surface rounded p-2">
                  {question.explanation}
                </p>
              </div>

              <span className="text-gray-600 text-xs flex-shrink-0">#{i + 1}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
