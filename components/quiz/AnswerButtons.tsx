'use client'

type FeedbackState = 'none' | 'correct' | 'incorrect'

interface AnswerButtonsProps {
  onAnswer: (answer: boolean) => void
  disabled: boolean
  feedbackState: FeedbackState
  correctAnswer?: boolean
  userAnswer?: boolean
}

export function AnswerButtons({
  onAnswer,
  disabled,
  feedbackState,
  correctAnswer,
  userAnswer,
}: AnswerButtonsProps) {
  function getButtonClass(value: boolean): string {
    const base =
      'flex-1 py-4 px-6 rounded-card-lg border-2 font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 '

    if (feedbackState === 'none') {
      return base + 'border-surface-alt bg-surface hover:border-primary hover:bg-primary/10 hover:text-primary'
    }

    // After answering: show result colors
    const isCorrectButton = value === correctAnswer
    const isUserChoice = value === userAnswer

    if (isCorrectButton) {
      return base + 'border-success bg-success/20 text-success'
    }
    if (isUserChoice && !isCorrectButton) {
      return base + 'border-error bg-error/20 text-error'
    }
    return base + 'border-surface-alt bg-surface text-gray-500'
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => !disabled && onAnswer(true)}
        disabled={disabled}
        className={getButtonClass(true)}
      >
        <span>✓</span>
        <span>Verdadeiro</span>
      </button>
      <button
        onClick={() => !disabled && onAnswer(false)}
        disabled={disabled}
        className={getButtonClass(false)}
      >
        <span>✗</span>
        <span>Falso</span>
      </button>
    </div>
  )
}
