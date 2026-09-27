import { useCallback, useRef, useState } from 'react'

export interface ToastItem {
  id: number
  variant: 'error' | 'success' | 'info'
  title: string
  detail?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (variant: ToastItem['variant'], title: string, detail?: string) => {
      const id = ++counter.current
      setToasts((current) => [...current, { id, variant, title, detail }])
      window.setTimeout(() => dismiss(id), 6000)
    },
    [dismiss]
  )

  return { toasts, dismiss, push }
}
