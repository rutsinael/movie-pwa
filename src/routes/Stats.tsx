export function Stats() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Статистика</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-sm text-gray-600">Просмотрено</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-sm text-gray-600">К просмотру</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-sm text-gray-600">⭐ Средняя оценка</div>
          <div className="text-2xl font-bold">0.0</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-sm text-gray-600">🕒 Часов просмотра</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 p-6 text-center">
        <div className="text-5xl mb-2">📊</div>
        <div className="text-lg font-semibold">Нет данных</div>
        <div className="text-sm text-gray-600">Начните добавлять и смотреть фильмы, чтобы увидеть статистику</div>
      </div>
    </div>
  )
}


