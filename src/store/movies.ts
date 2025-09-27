import { create } from 'zustand'
import type { MovieEntity, NewMovieInput } from '../types'
import { generateUuid } from '../lib/uuid'
import { supabase } from '../lib/supabase'

interface MoviesState {
  movies: MovieEntity[]
  loading: boolean
  loadMovies: () => Promise<void>
  addMovie: (input: NewMovieInput) => Promise<MovieEntity | undefined>
  updateMovie: (uuid: string, patch: Partial<MovieEntity>) => Promise<void>
  deleteMovie: (uuid: string) => Promise<void>
}

export const useMovies = create<MoviesState>((set, get) => ({
  movies: [],
  loading: false,

  loadMovies: async () => {
    set({ loading: true })
    try {
      if (!supabase) return
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('room_key', '1')
        .order('created_at', { ascending: false })
      if (error) throw error
      const list: MovieEntity[] = (data || []).map((r: any) => ({
        id: undefined,
        uuid: r.uuid,
        title: r.title,
        status: r.status,
        aiTip: !!r.ai_tip,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        tags: r.tags ?? undefined,
        posterUrl: r.poster_url ?? null,
      }))
      set({ movies: list })
    } finally {
      set({ loading: false })
    }
  },

  addMovie: async (input) => {
    if (!supabase) return undefined
    const now = new Date().toISOString()
    const entity: MovieEntity = {
      uuid: generateUuid(),
      title: input.title.trim(),
      status: input.status ?? 'to_watch',
      aiTip: input.aiTip ?? false,
      createdAt: now,
      updatedAt: now,
      tags: input.tags,
      posterUrl: input.posterUrl ?? null,
    }
    if (!entity.title) return undefined
    const row = {
      room_key: '1',
      uuid: entity.uuid,
      title: entity.title,
      status: entity.status,
      ai_tip: entity.aiTip,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      tags: entity.tags ?? null,
      poster_url: entity.posterUrl ?? null,
    }
    const { error } = await supabase.from('movies').insert([row])
    if (error) throw error
    set({ movies: [entity, ...get().movies] })
    return entity
  },

  updateMovie: async (uuid, patch) => {
    if (!supabase) return
    const current = get().movies
    const idx = current.findIndex((m) => m.uuid === uuid)
    if (idx === -1) return
    const updated: MovieEntity = {
      ...current[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    const row = {
      title: updated.title,
      status: updated.status,
      ai_tip: updated.aiTip,
      updated_at: updated.updatedAt,
      tags: updated.tags ?? null,
      poster_url: updated.posterUrl ?? null,
    }
    const { error } = await supabase
      .from('movies')
      .update(row)
      .eq('room_key', '1')
      .eq('uuid', uuid)
    if (error) throw error
    const next = [...current]
    next[idx] = updated
    set({ movies: next })
  },

  deleteMovie: async (uuid) => {
    if (!supabase) return
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('room_key', '1')
      .eq('uuid', uuid)
    if (error) throw error
    set({ movies: get().movies.filter((m) => m.uuid !== uuid) })
  },
}))


