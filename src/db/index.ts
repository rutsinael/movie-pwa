import Dexie from 'dexie'
import type { Table } from 'dexie'
import type { MovieEntity } from '../types'

class MovieDB extends Dexie {
  movies!: Table<MovieEntity, number>

  constructor() {
    super('movie-organizer')
    this.version(1).stores({
      movies: '++id, status, aiTip, createdAt, updatedAt, title',
    })
    this.version(2).upgrade((tx) =>
      tx.table('movies').toCollection().modify((m: any) => {
        if (!m.uuid) {
          m.uuid = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
        }
      })
    )
    this.version(2).stores({
      movies: '++id, uuid, status, aiTip, createdAt, updatedAt, title',
    })

    this.version(3).upgrade((tx) =>
      tx.table('movies').toCollection().modify((m: any) => {
        if (typeof m.posterUrl === 'undefined') m.posterUrl = null
      })
    )
    this.version(3).stores({
      movies: '++id, uuid, status, aiTip, createdAt, updatedAt, title, posterUrl',
    })
  }
}

export const db = new MovieDB()


