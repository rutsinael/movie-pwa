export interface TMDBMovieBrief {
  id: number
  title: string
  original_title?: string
  overview?: string
  release_date?: string
  poster_url: string | null
  backdrop_url: string | null
  vote_average?: number
  vote_count?: number
}

export interface TMDBSearchResponse {
  page: number
  total_pages: number
  total_results: number
  results: TMDBMovieBrief[]
}

export async function searchMovies(query: string, page = 1): Promise<TMDBSearchResponse> {
  const url = new URL('/api/tmdb/search', window.location.origin)
  url.searchParams.set('q', query)
  url.searchParams.set('page', String(page))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}


