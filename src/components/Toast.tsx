import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import type { ToastItem } from '../hooks/useToast'

interface ToastProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

const styles = {
  error: { icon: AlertTriangle, accent: 'border-rose-400/40 text-rose-400' },
  success: { icon: CheckCircle2, accent: 'border-moss-400/40 text-moss-400' },
  info: { icon: Info, accent: 'border-tide-400/40 text-tide-400' }
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[1000] flex w-full max-w-sm flex-col gap-2.5">
      {toasts.map((t) => {
        const { icon: Icon, accent } = styles[t.variant]
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-base-panel p-3.5 shadow-float ${accent}`}
          >
            <Icon size={16} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-paper">{t.title}</p>
              {t.detail && <p className="mt-0.5 text-xs text-ink-soft">{t.detail}</p>}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 text-ink-soft transition hover:text-paper"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
