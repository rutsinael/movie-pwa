import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMovies } from '../store/movies'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [title, setTitle] = useState('')
  const { loadMovies, addMovie } = useMovies()

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  // Supabase-only: refresh on focus and periodically
  useEffect(() => {
    // Initial load
    loadMovies()

    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') loadMovies()
    }
    document.addEventListener('visibilitychange', visibilityHandler)
    const interval = window.setInterval(loadMovies, 60_000)
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler)
      window.clearInterval(interval)
    }
  }, [loadMovies])

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-screen-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 grid place-items-center">🎬</div>
              <div className="text-base font-semibold">Movie Organizer</div>
            </div>
            <button className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 grid place-items-center" aria-label="Профиль">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-sm flex-1 overflow-auto">
        <Outlet />
      </main>

      <button
        className="fixed bottom-20 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Поиск"
        onClick={() => navigate('/search', { state: { focusSearch: true } })}
      >
        +
      </button>

      {isAddOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsAddOpen(false)} />
          <div className="z-40 w-full max-w-screen-sm rounded-t-2xl bg-white p-4 shadow-lg sm:rounded-2xl">
            <div className="mb-3 text-lg font-semibold">Добавить фильм</div>
            <div className="space-y-3">
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Название"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button className="rounded-lg px-4 py-2 text-gray-600" onClick={() => setIsAddOpen(false)}>Отмена</button>
                <button
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
                  disabled={!title.trim()}
                  onClick={async () => {
                    const saved = await addMovie({ title: title.trim(), status: 'to_watch' })
                    if (saved) {
                      setTitle('')
                      setIsAddOpen(false)
                    }
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto grid w-full max-w-screen-sm grid-cols-4 text-sm">
          <TabLink to="/" label="Главная" current={location.pathname === '/'} />
          <TabLink to="/search" label="Поиск" current={location.pathname.startsWith('/search')} />
          <TabLink to="/library" label="Библиотека" current={location.pathname.startsWith('/library')} />
          <TabLink to="/stats" label="Статистика" current={location.pathname.startsWith('/stats')} />
        </div>
      </nav>
    </div>
  )
}

function TabLink({ to, label, current }: { to: string; label: string; current: boolean }) {
  return (
    <NavLink
      to={to}
      className={`flex items-center justify-center gap-1 px-2 py-3 ${current ? 'text-indigo-600' : 'text-gray-600'}`}
    >
      <span>{label}</span>
    </NavLink>
  )
}


