export function Search() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Поиск</h1>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Найдите фильм..."
      />
      <div className="text-sm text-gray-500">Введите запрос, чтобы увидеть результаты</div>
    </div>
  )
}


