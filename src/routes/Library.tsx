import { useMovies } from '../store/movies'

export function Library() {
  const { movies, updateMovie, deleteMovie } = useMovies()

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Библиотека</h1>
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
                  onClick={() => deleteMovie(m.id!)}
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


