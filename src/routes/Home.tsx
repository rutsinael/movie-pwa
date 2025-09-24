export function Home() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Главная</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-600">Хочу</div>
        </div>
        <div className="rounded-xl bg-gray-100 p-4 text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-600">Просмотрено</div>
        </div>
      </div>
      <button className="w-full rounded-lg bg-indigo-600 text-white py-3">🎲 Случайный фильм</button>
    </div>
  )
}


