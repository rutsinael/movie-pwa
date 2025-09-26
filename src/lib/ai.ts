export interface AISuggestion { title: string; reason: string }
export interface AISuggestionsResponse { suggestions: AISuggestion[]; note: string }

export async function getAISuggestions(payload: {
  preferences: string
  movies: Array<{ title: string; status?: 'to_watch' | 'watched'; tags?: string[] }>
}): Promise<AISuggestionsResponse> {
  const res = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    // Try to surface the exact error message from the server/OpenAI
    let message = 'Ошибка ИИ: не удалось получить подборку'
    try {
      const err = await res.json()
      if (typeof err?.details === 'string') {
        try {
          const inner = JSON.parse(err.details)
          const innerMsg = inner?.error?.message
          if (innerMsg) message = innerMsg
        } catch {
          message = err.details
        }
      } else if (typeof err?.error === 'string') {
        message = err.error
      }
    } catch {}
    throw new Error(message)
  }
  return res.json()
}


