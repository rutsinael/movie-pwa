import { useMemo, useState } from 'react'
import { useMovies } from '../store/movies'
import { getAISuggestions, type AISuggestion } from '../lib/ai'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { useToast } from '../components/Toast'
import { weightedRandomPick } from '../lib/random'

export function Home() {
  const { movies } = useMovies()
  const [aiLoading, setAiLoading] = useState(false)
  const [aiItems, setAiItems] = useState<AISuggestion[]>([])
  const [aiNote, setAiNote] = useState('')
  const toast = useToast()
  const [randomPoster, setRandomPoster] = useState<{ title: string; posterUrl: string | null } | null>(null)
  const counts = useMemo(() => {
    const toWatch = movies.filter((m) => m.status === 'to_watch').length
    const watched = movies.filter((m) => m.status === 'watched').length
    return { toWatch, watched }
  }, [movies])

  usePullToRefresh(() => {
    toast.show('Обновлено')
  })

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Найти фильм..."
          readOnly
          onClick={() => window.location.assign('/search')}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-yellow-50 p-4 text-center border border-yellow-100">
          <div className="text-sm text-gray-600">К просмотру</div>
          <div className="text-2xl font-bold">{counts.toWatch}</div>
        </div>
        <div className="rounded-xl bg-green-50 p-4 text-center border border-green-100">
          <div className="text-sm text-gray-600">Просмотрено</div>
          <div className="text-2xl font-bold">{counts.watched}</div>
        </div>
        <div className="rounded-xl bg-purple-50 p-4 text-center border border-purple-100">
          <div className="text-sm text-gray-600">ИИ советы</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-blue-50 p-4">
        <button
          className="w-full rounded-lg bg-blue-600 text-white py-3"
          onClick={() => {
            const pool = movies.filter((m) => m.status === 'to_watch')
            if (pool.length === 0) return
            const pick = weightedRandomPick(pool)
            if (pick) {
              setRandomPoster({ title: pick.title, posterUrl: pick.posterUrl ?? null })
            }
          }}
        >
          🧮 🎲 Случайный фильм
        </button>
        {randomPoster ? (
          <div className="mt-3 flex items-center gap-3">
            {randomPoster.posterUrl ? (
              <img src={randomPoster.posterUrl} alt={randomPoster.title} className="h-20 w-14 rounded object-cover" />
            ) : (
              <div className="h-20 w-14 rounded bg-white/70" />
            )}
            <div className="font-medium">{randomPoster.title}</div>
          </div>
        ) : (
          <div className="mt-2 text-center text-sm text-gray-600">Добавьте фильмы в список, чтобы получить случайный выбор</div>
        )}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 rounded-lg border px-3 py-2 bg-white">📝 Хочу посмотреть</button>
        <button className="flex-1 rounded-lg border px-3 py-2 bg-white">✅ Просмотрено</button>
        <button className="flex-1 rounded-lg border px-3 py-2 bg-white">🤖 ИИ</button>
      </div>

      <div className="rounded-xl border border-gray-200 p-6 text-center">
        <div className="text-5xl mb-2">✅</div>
        <div className="text-lg font-semibold">Ничего не просмотрено</div>
        <div className="text-sm text-gray-600">Отметьте фильмы как просмотренные, чтобы получить рекомендации</div>
      </div>

      <div className="space-y-2">
        <div className="text-base font-semibold">ИИ‑подборка</div>
        <button
          className="rounded-lg bg-gray-900 text-white px-4 py-2 disabled:opacity-50"
          disabled={aiLoading}
          onClick={async () => {
            setAiLoading(true)
            try {
              const payload = {
                preferences: '',
                movies: movies.map((m) => ({ title: m.title, status: m.status })),
              }
              const res = await getAISuggestions(payload)
              setAiItems(res.suggestions)
              setAiNote(res.note)
            } catch {
              setAiItems([])
              setAiNote('')
            } finally {
              setAiLoading(false)
            }
          }}
        >
          {aiLoading ? 'Загрузка…' : 'Получить подборку'}
        </button>
        {aiNote && <div className="text-sm text-gray-600">{aiNote}</div>}
        <ul className="space-y-2">
          {aiItems.map((s, i) => (
            <li key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-gray-500">{s.reason}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


