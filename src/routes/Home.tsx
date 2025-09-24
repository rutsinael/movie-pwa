import { useMemo, useState } from 'react'
import { useMovies } from '../store/movies'
import { getAISuggestions, type AISuggestion } from '../lib/ai'

export function Home() {
  const { movies } = useMovies()
  const [aiLoading, setAiLoading] = useState(false)
  const [aiItems, setAiItems] = useState<AISuggestion[]>([])
  const [aiNote, setAiNote] = useState('')
  const counts = useMemo(() => {
    const toWatch = movies.filter((m) => m.status === 'to_watch').length
    const watched = movies.filter((m) => m.status === 'watched').length
    return { toWatch, watched }
  }, [movies])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Главная</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">{counts.toWatch}</div>
          <div className="text-sm text-gray-600">Хочу</div>
        </div>
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">{counts.watched}</div>
          <div className="text-sm text-gray-600">Просмотрено</div>
        </div>
      </div>
      <button className="w-full rounded-lg bg-indigo-600 text-white py-3">🎲 Случайный фильм</button>

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


