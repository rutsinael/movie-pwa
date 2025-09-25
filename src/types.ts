export type MovieStatus = 'to_watch' | 'watched'

export interface MovieEntity {
  id?: number
  uuid: string
  title: string
  status: MovieStatus
  aiTip: boolean
  createdAt: string
  updatedAt: string
  tags?: string[]
  posterUrl?: string | null
}

export interface NewMovieInput {
  title: string
  status?: MovieStatus
  aiTip?: boolean
  tags?: string[]
  posterUrl?: string | null
}


