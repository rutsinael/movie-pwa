// Vercel Node serverless function: /api/ai/suggestions
// Uses OpenAI API with OPENAI_API_KEY (do not expose to client)

type InMovie = { title: string; status?: 'to_watch' | 'watched'; tags?: string[] }

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: 'Missing OPENAI_API_KEY' })
      return
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const preferences: string = body?.preferences ?? ''
    const movies: InMovie[] = Array.isArray(body?.movies) ? body.movies : []

    const system = `Ты — помощник по кино. На основе предпочтений пользователя и его списка фильмов предложи 5 фильмов к просмотру. Верни строгий JSON с полями: { "suggestions": [{ "title": string, "reason": string }], "note": string }. Не добавляй лишний текст.`
    const user = {
      preferences,
      library: movies,
      locale: 'ru-RU',
      constraints: 'Вывод строго в JSON, 5 фильмов.'
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(user) },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!openaiRes.ok) {
      const text = await openaiRes.text()
      res.status(openaiRes.status).json({ error: 'OpenAI error', details: text })
      return
    }

    const data = await openaiRes.json()
    const content = data?.choices?.[0]?.message?.content
    let payload: any = null
    try {
      payload = JSON.parse(content)
    } catch {
      payload = { suggestions: [], note: '' }
    }

    const suggestions = Array.isArray(payload?.suggestions)
      ? payload.suggestions
          .filter((s: any) => s && typeof s.title === 'string')
          .map((s: any) => ({ title: s.title, reason: String(s.reason ?? '') }))
      : []
    const note = typeof payload?.note === 'string' ? payload.note : ''

    res.status(200).json({ suggestions, note })
  } catch (err: any) {
    res.status(500).json({ error: 'Internal error', message: err?.message || String(err) })
  }
}


