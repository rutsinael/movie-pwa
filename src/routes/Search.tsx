import { useEffect, useRef, useState } from 'react'
import { searchMovies, type TMDBMovieBrief } from '../lib/api'
import { useMovies } from '../store/movies'
import { useLocation } from 'react-router-dom'
import { useToast } from '../components/Toast'

export function Search() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TMDBMovieBrief[]>([])
  const { addMovie } = useMovies()
  const location = useLocation() as { state?: { focusSearch?: boolean } }
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (location.state?.focusSearch) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [location.state])

  const debounced = useDebouncedValue(q, 350)

  useEffect(() => {
    const fetchData = async () => {
      const query = debounced.trim()
      if (!query) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const data = await searchMovies(query)
        setResults(data.results)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [debounced])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Поиск</h1>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Найдите фильм..."
        value={q}
        ref={inputRef}
        onChange={(e) => setQ(e.target.value)}
      />
      {loading && <div className="text-sm text-gray-500">Загрузка…</div>}
      {!loading && results.length === 0 && (
        <div className="text-sm text-gray-500">Введите запрос, чтобы увидеть результаты</div>
      )}
      <ul className="space-y-3">
        {results.map((m) => (
          <li key={m.id} className="flex gap-3 rounded-lg border border-gray-200 p-3">
            {m.poster_url ? (
              <img src={m.poster_url} alt={m.title} className="h-24 w-16 rounded object-cover" />
            ) : (
              <div className="h-24 w-16 rounded bg-gray-100" />)
            }
            <div className="flex-1">
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-gray-500 line-clamp-2">{m.overview}</div>
              <div className="mt-2">
                <button
                  className="rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                  onClick={async () => {
                    const saved = await addMovie({ title: m.title, status: 'to_watch', posterUrl: m.poster_url })
                    if (saved) toast.show('Добавлено в библиотеку')
                  }}
                >
                  Добавить
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return v
}


