// Vercel Node serverless function: /api/tmdb/search
// Uses TMDB v4 token from env TMDB_V4_TOKEN

const TMDB_API = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'
const POSTER_SIZE = 'w500'

function buildImage(path?: string | null): string | null {
  if (!path) return null
  return `${IMAGE_BASE}/${POSTER_SIZE}${path}`
}

export default async function handler(req: any, res: any) {
  try {
    const token = process.env.TMDB_V4_TOKEN
    if (!token) {
      res.status(500).json({ error: 'Missing TMDB_V4_TOKEN' })
      return
    }

    const q = (req.query?.q as string) || ''
    const page = parseInt((req.query?.page as string) || '1', 10)
    if (!q.trim()) {
      res.status(400).json({ error: 'Missing q' })
      return
    }

    const url = new URL(`${TMDB_API}/search/movie`)
    url.searchParams.set('query', q)
    url.searchParams.set('include_adult', 'false')
    url.searchParams.set('language', 'ru-RU')
    url.searchParams.set('page', String(page))

    const tmdbRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    })

    if (!tmdbRes.ok) {
      const text = await tmdbRes.text()
      res.status(tmdbRes.status).json({ error: 'TMDB error', details: text })
      return
    }

    const data = await tmdbRes.json()
    const results = Array.isArray(data.results) ? data.results : []

    const normalized = results.map((r: any) => ({
      id: r.id,
      title: r.title,
      original_title: r.original_title,
      overview: r.overview,
      release_date: r.release_date,
      poster_url: buildImage(r.poster_path),
      backdrop_url: buildImage(r.backdrop_path),
      vote_average: r.vote_average,
      vote_count: r.vote_count,
    }))

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
    res.status(200).json({ page: data.page, total_pages: data.total_pages, total_results: data.total_results, results: normalized })
  } catch (err: any) {
    res.status(500).json({ error: 'Internal error', message: err?.message || String(err) })
  }
}


