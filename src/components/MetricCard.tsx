import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: ReactNode
  unit?: string
  accent?: 'moss' | 'tide' | 'amber' | 'neutral'
  footnote?: string
  copyableText?: string
}

const accentMap = {
  moss: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: 'text-emerald-400 bg-emerald-500/15',
    value: 'text-emerald-400'
  },
  tide: {
    bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    icon: 'text-cyan-400 bg-cyan-500/15',
    value: 'text-cyan-300'
  },
  amber: {
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    icon: 'text-amber-400 bg-amber-500/15',
    value: 'text-amber-300'
  },
  neutral: {
    bg: 'bg-slate-800/60 border-slate-700/60 text-slate-300',
    icon: 'text-slate-300 bg-slate-700/50',
    value: 'text-slate-100'
  }
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  accent = 'neutral',
  footnote,
  copyableText
}: MetricCardProps) {
  const [copied, setCopied] = useState(false)
  const styles = accentMap[accent]

  const handleCopy = () => {
    if (!copyableText) return
    navigator.clipboard.writeText(copyableText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-xl border border-slate-700/70 bg-slate-900/90 p-3.5 shadow-md backdrop-blur transition hover:border-slate-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${styles.icon}`}>
            <Icon size={14} strokeWidth={2.2} />
          </span>
          <p className="text-xs font-medium text-slate-400">{label}</p>
        </div>
        {copyableText && (
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        )}
      </div>

      <div className="mt-2.5">
        <p className="font-display text-lg font-bold tracking-tight text-white">
          {value}
          {unit && <span className="ml-1 text-xs font-semibold text-slate-400">{unit}</span>}
        </p>
        {footnote && <p className="mt-1 text-[11px] font-medium text-slate-400">{footnote}</p>}
      </div>
    </div>
  )
}
