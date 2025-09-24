import { useEffect, useRef } from 'react'

export function usePullToRefresh(callback: () => void) {
  const startY = useRef<number | null>(null)
  const pulled = useRef(false)

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0]?.clientY ?? null
        pulled.current = false
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (startY.current == null) return
      const dy = (e.touches[0]?.clientY ?? 0) - startY.current
      if (dy > 70) {
        pulled.current = true
      }
    }
    const onTouchEnd = () => {
      if (pulled.current) callback()
      startY.current = null
      pulled.current = false
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [callback])
}


