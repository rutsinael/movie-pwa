import { useMovies } from '../store/movies'
import { useEffect, useState } from 'react'
import { pullMovies, pushMovies } from '../sync'
import { useToast } from '../components/Toast'

export function Library() {
  const { movies, updateMovie, deleteMovie } = useMovies()
  const [roomKey, setRoomKey] = useState('')
  const [syncing, setSyncing] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const saved = localStorage.getItem('roomKey')
    if (saved) setRoomKey(saved)
  }, [])
  useEffect(() => {
    localStorage.setItem('roomKey', roomKey)
  }, [roomKey])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Библиотека</h1>
      <div className="flex items-end gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
          placeholder="roomKey для синхронизации"
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value)}
        />
        <button
          className="rounded bg-indigo-600 px-3 py-2 text-white disabled:opacity-50"
          disabled={!roomKey.trim() || syncing}
          onClick={async () => {
            setSyncing(true)
            try {
              await pushMovies(roomKey.trim())
              await pullMovies(roomKey.trim())
              toast.show('Синхронизация завершена')
            } finally {
              setSyncing(false)
            }
          }}
        >
          {syncing ? 'Синхронизация…' : 'Синхронизировать'}
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="text-sm text-gray-500">Ваши фильмы появятся здесь</div>
      ) : (
        <ul className="space-y-2">
          {movies.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
              <div>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-gray-500">{m.status === 'to_watch' ? 'Хочу' : 'Просмотрено'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded bg-gray-100 px-3 py-1 text-sm"
                  onClick={() =>
                    updateMovie(m.id!, { status: m.status === 'to_watch' ? 'watched' : 'to_watch' })
                  }
                >
                  Переключить
                </button>
                <button
                  className="rounded bg-red-50 px-3 py-1 text-sm text-red-600"
                  onClick={() => {
                    if (confirm(`Удалить «${m.title}»?`)) {
                      deleteMovie(m.id!)
                      toast.show('Удалено')
                    }
                  }}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


