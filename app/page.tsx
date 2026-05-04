import { LandingForm } from '@/components/LandingForm'

const LEVEL_PREVIEWS = [
  {
    name: 'Iniciante',
    color: 'text-primary',
    border: 'border-primary/30',
    bg: 'bg-primary/10',
    pts: '100 pts/acerto',
    timer: '5 min',
    max: '1.000 pts',
  },
  {
    name: 'Intermediário',
    color: 'text-blue',
    border: 'border-blue/30',
    bg: 'bg-blue/10',
    pts: '150 pts/acerto',
    timer: '4 min',
    max: '1.500 pts',
  },
  {
    name: 'Avançado',
    color: 'text-orange',
    border: 'border-orange/30',
    bg: 'bg-orange/10',
    pts: '200 pts/acerto',
    timer: '3 min',
    max: '2.000 pts',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
            Quiz Verdadeiro ou Falso
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Quiz{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue">
              Claude Code
            </span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Teste e amplie seus conhecimentos sobre Claude Code em 3 níveis
            progressivos com 30 perguntas de Verdadeiro ou Falso.
          </p>
        </div>

        {/* Level Previews */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {LEVEL_PREVIEWS.map((level) => (
            <div
              key={level.name}
              className={`rounded-card border ${level.border} ${level.bg} p-3 text-center`}
            >
              <div className={`text-sm font-semibold ${level.color} mb-1`}>
                {level.name}
              </div>
              <div className="text-xs text-gray-400">{level.pts}</div>
              <div className="text-xs text-gray-500">{level.timer} · max {level.max}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <LandingForm />
      </div>
    </main>
  )
}
