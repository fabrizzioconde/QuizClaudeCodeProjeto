'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GameMode } from '@/lib/types'
import { useQuiz } from '@/context/QuizContext'

export function LandingForm() {
  const router = useRouter()
  const { startSession } = useQuiz()

  const [mode, setMode] = useState<GameMode>('normal')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ nickname?: string; email?: string }>({})

  function validate(): boolean {
    const errs: { nickname?: string; email?: string } = {}
    if (nickname.trim().length < 2) {
      errs.nickname = 'Nickname deve ter pelo menos 2 caracteres.'
    } else if (nickname.trim().length > 20) {
      errs.nickname = 'Nickname deve ter no máximo 20 caracteres.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      errs.email = 'Informe um e-mail válido.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    startSession(nickname.trim(), email.trim(), mode)
    router.push('/quiz')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-surface-alt rounded-card-lg p-6 space-y-5">
      {/* Mode Toggle */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Modo de jogo</label>
        <div className="grid grid-cols-2 gap-2">
          {([['normal', '⚡ Normal', 'Com timer e leaderboard'], ['practice', '📚 Prática', 'Sem timer, foco em aprender']] as const).map(
            ([value, label, desc]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`p-3 rounded-card border-2 text-left transition-all ${
                  mode === value
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-alt hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </button>
            )
          )}
        </div>
      </div>

      {/* Nickname */}
      <div>
        <label className="block text-sm text-gray-400 mb-1" htmlFor="nickname">
          Nickname
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Seu nome no ranking"
          maxLength={20}
          className={`w-full px-4 py-2.5 bg-bg border rounded-card text-sm outline-none focus:border-primary transition-colors ${
            errors.nickname ? 'border-error' : 'border-surface-alt'
          }`}
        />
        {errors.nickname && (
          <p className="text-xs text-error mt-1">{errors.nickname}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-gray-400 mb-1" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className={`w-full px-4 py-2.5 bg-bg border rounded-card text-sm outline-none focus:border-primary transition-colors ${
            errors.email ? 'border-error' : 'border-surface-alt'
          }`}
        />
        {errors.email && (
          <p className="text-xs text-error mt-1">{errors.email}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-card-lg bg-gradient-to-r from-primary-dark to-primary font-bold text-white hover:opacity-90 transition-opacity"
      >
        COMEÇAR QUIZ
      </button>
    </form>
  )
}
