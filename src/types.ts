export type MovieStatus = 'to_watch' | 'watched'

export interface MovieEntity {
  id?: number
  title: string
  status: MovieStatus
  aiTip: boolean
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface NewMovieInput {
  title: string
  status?: MovieStatus
  aiTip?: boolean
  tags?: string[]
}


