import { create } from 'zustand'
import { db } from '../db'
import type { MovieEntity, NewMovieInput } from '../types'
import { generateUuid } from '../lib/uuid'

interface MoviesState {
  movies: MovieEntity[]
  loading: boolean
  loadMovies: () => Promise<void>
  addMovie: (input: NewMovieInput) => Promise<MovieEntity | undefined>
  updateMovie: (id: number, patch: Partial<MovieEntity>) => Promise<void>
  deleteMovie: (id: number) => Promise<void>
}

export const useMovies = create<MoviesState>((set, get) => ({
  movies: [],
  loading: false,

  loadMovies: async () => {
    set({ loading: true })
    try {
      const list = await db.movies.orderBy('createdAt').reverse().toArray()
      set({ movies: list })
    } finally {
      set({ loading: false })
    }
  },

  addMovie: async (input) => {
    const now = new Date().toISOString()
    const entity: MovieEntity = {
      uuid: generateUuid(),
      title: input.title.trim(),
      status: input.status ?? 'to_watch',
      aiTip: input.aiTip ?? false,
      createdAt: now,
      updatedAt: now,
      tags: input.tags,
    }
    if (!entity.title) return undefined
    const id = await db.movies.add(entity)
    const saved = { ...entity, id }
    set({ movies: [saved, ...get().movies] })
    return saved
  },

  updateMovie: async (id, patch) => {
    const current = get().movies
    const idx = current.findIndex((m) => m.id === id)
    if (idx === -1) return
    const updated: MovieEntity = {
      ...current[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    await db.movies.update(id, updated)
    const next = [...current]
    next[idx] = updated
    set({ movies: next })
  },

  deleteMovie: async (id) => {
    await db.movies.delete(id)
    set({ movies: get().movies.filter((m) => m.id !== id) })
  },
}))


