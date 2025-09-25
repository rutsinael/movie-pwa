import { supabase } from '../lib/supabase'
import { db } from '../db'
import type { MovieEntity } from '../types'

const TABLE = 'movies'

export async function pullMovies(roomKey: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('room_key', roomKey)
  if (error) throw error
  const remote: any[] = data || []
  const mapped: MovieEntity[] = remote.map((r) => ({
    id: undefined,
    uuid: r.uuid,
    title: r.title,
    status: r.status,
    aiTip: !!r.ai_tip,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    tags: r.tags ?? undefined,
  }))

  // Last-write-wins by updatedAt
  const local = await db.movies.toArray()
  const localByUuid = new Map(local.map((m) => [m.uuid, m]))
  for (const m of mapped) {
    const existing = localByUuid.get(m.uuid)
    if (!existing) {
      await db.movies.add(m)
    } else if (existing.updatedAt < m.updatedAt) {
      await db.movies.put({ ...m, id: existing.id })
    }
  }
}

export async function pushMovies(roomKey: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const local = await db.movies.toArray()
  const rows = local.map((m) => ({
    room_key: roomKey,
    uuid: m.uuid,
    title: m.title,
    status: m.status,
    ai_tip: m.aiTip,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
    tags: m.tags ?? null,
  }))
  // Upsert by (room_key, uuid)
  const { error } = await supabase
    .from(TABLE)
    .upsert(rows, { onConflict: 'room_key,uuid' })
  if (error) throw error
}


