import { createContext, useContext, useMemo, useState } from 'react'

type Toast = { id: number; message: string }
type ToastContextValue = { show: (message: string) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const api = useMemo<ToastContextValue>(() => ({
    show: (message) => {
      const id = Date.now() + Math.random()
      setItems((prev) => [...prev, { id, message }])
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id))
      }, 2500)
    },
  }), [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-16 z-50 mx-auto flex w-full max-w-screen-sm flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full rounded-lg bg-gray-900/90 px-4 py-2 text-white shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


