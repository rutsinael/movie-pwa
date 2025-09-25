import type { MovieEntity } from '../types'

const RECENT_KEY = 'recentPicks'
const RECENT_LIMIT = 10

function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(-RECENT_LIMIT)))
  } catch {}
}

export function weightedRandomPick(movies: MovieEntity[]): MovieEntity | null {
  if (movies.length === 0) return null
  const recent = new Set(getRecent())

  // Больше вес для новых записей и тех, что не брали недавно
  const now = Date.now()
  const weights = movies.map((m) => {
    const ageMs = now - new Date(m.createdAt).getTime()
    const ageDays = Math.max(1, ageMs / (1000 * 60 * 60 * 24))
    const base = 1 / Math.sqrt(ageDays) // чуть чаще новые
    const penalty = recent.has(m.uuid) ? 0.4 : 1 // штраф для недавно выбранных
    return Math.max(0.0001, base * penalty)
  })

  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < movies.length; i++) {
    r -= weights[i]
    if (r <= 0) {
      const pick = movies[i]
      const nextRecent = [...getRecent(), pick.uuid]
      saveRecent(nextRecent)
      return pick
    }
  }
  return movies[movies.length - 1]
}


