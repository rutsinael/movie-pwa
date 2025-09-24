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
  if (!res.ok) throw new Error('AI suggestions failed')
  return res.json()
}


