import { useMovies } from '../store/movies'
 
import { useToast } from '../components/Toast'

export function Library() {
  const { movies, updateMovie, deleteMovie } = useMovies()
  const toast = useToast()

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Библиотека</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-sm text-gray-600">К просмотру</div>
          <div className="text-2xl font-bold">{movies.filter(m=>m.status==='to_watch').length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-sm text-gray-600">Просмотрено</div>
          <div className="text-2xl font-bold">{movies.filter(m=>m.status==='watched').length}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2" placeholder="Поиск в библиотеке..." />
        <div className="flex gap-2">
          <select className="rounded-lg border border-gray-300 px-2 py-2">
            <option>Все фильмы</option>
          </select>
          <select className="rounded-lg border border-gray-300 px-2 py-2">
            <option>По дате добавления</option>
          </select>
        </div>
      </div>
      {/* Автосинхронизация включена. Поле roomKey и кнопка синка убраны. */}

      {movies.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-5xl mb-2">📚</div>
          <div className="text-lg font-semibold">Библиотека пуста</div>
          <div className="text-sm text-gray-600">Добавьте фильмы в свою коллекцию</div>
        </div>
      ) : (
        <ul className="space-y-2">
          {movies.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
              {m.posterUrl ? (
                <img src={m.posterUrl} alt={m.title} className="h-16 w-12 rounded object-cover" />
              ) : (
                <div className="h-16 w-12 rounded bg-gray-100" />
              )}
              <div className="flex-1">
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


