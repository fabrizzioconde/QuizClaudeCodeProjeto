import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-gray-400">Página não encontrada.</p>
      <Link
        href="/"
        className="mt-2 px-6 py-2 rounded-card bg-primary-dark text-white font-semibold hover:bg-primary transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
