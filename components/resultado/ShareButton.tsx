'use client'

import { useState } from 'react'
import type { QuizSession } from '@/lib/types'
import { formatScoreForShare } from '@/lib/quiz-engine'

interface ShareButtonProps {
  session: QuizSession
}

export function ShareButton({ session }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const text = formatScoreForShare(session)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`w-full py-3 px-6 rounded-card-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
        copied
          ? 'bg-success/20 border border-success text-success'
          : 'bg-surface border border-surface-alt hover:border-primary hover:bg-primary/10 hover:text-primary'
      }`}
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <span>📤</span>
          <span>Compartilhar Resultado</span>
        </>
      )}
    </button>
  )
}
