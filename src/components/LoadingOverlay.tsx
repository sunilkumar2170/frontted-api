import { useEffect, useState } from 'react'
import { FileSearch, Mountain, Waves, Droplet } from 'lucide-react'

const STAGES = [
  { key: 'reading', label: 'Reading contour map', icon: FileSearch },
  { key: 'terrain', label: 'Building terrain model', icon: Mountain },
  { key: 'catchment', label: 'Tracing catchment', icon: Waves },
  { key: 'runoff', label: 'Estimating runoff', icon: Droplet }
] as const

export default function LoadingOverlay() {
  const [stageIndex, setStageIndex] = useState(0)

  // Purely cosmetic — cycles through stages while the real request is in flight.
  useEffect(() => {
    const id = window.setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
    }, 1400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-base/60 backdrop-blur-sm">
      <div className="w-64 rounded-2xl border border-base-line bg-base-panel p-5 shadow-float">
        <p className="mb-4 text-center font-display text-sm font-semibold text-paper">
          Analyzing terrain
        </p>
        <div className="space-y-3">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon
            const active = i === stageIndex
            const done = i < stageIndex
            return (
              <div key={stage.key} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                    done
                      ? 'bg-moss-500 text-base'
                      : active
                      ? 'bg-tide-400/20 text-tide-400'
                      : 'bg-base-line text-ink-soft'
                  }`}
                >
                  <Icon size={12} />
                </span>
                <span
                  className={`text-xs transition-colors ${
                    active ? 'text-paper' : done ? 'text-ink-soft' : 'text-ink-soft/60'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
