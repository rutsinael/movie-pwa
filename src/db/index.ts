import Dexie, { Table } from 'dexie'
import type { MovieEntity } from '../types'

class MovieDB extends Dexie {
  movies!: Table<MovieEntity, number>

  constructor() {
    super('movie-organizer')
    this.version(1).stores({
      movies: '++id, status, aiTip, createdAt, updatedAt, title',
    })
  }
}

export const db = new MovieDB()


