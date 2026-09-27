import { useState } from 'react'
import { Droplets, Settings, BookOpen, Code2, Activity } from 'lucide-react'
import MethodologyModal from './MethodologyModal'
import ApiModal from './ApiModal'
import SettingsModal from './SettingsModal'

interface HeaderProps {
  apiOnline: boolean | null
}

export default function Header({ apiOnline }: HeaderProps) {
  const [showMethodology, setShowMethodology] = useState(false)
  const [showApi, setShowApi] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const statusLabel = apiOnline === null ? 'Checking…' : apiOnline ? 'API Online' : 'API Offline'
  const statusColor =
    apiOnline === null ? 'bg-amber-400' : apiOnline ? 'bg-emerald-400' : 'bg-rose-400'
  const statusBorder =
    apiOnline === null
      ? 'border-amber-500/30 text-amber-300'
      : apiOnline
      ? 'border-emerald-500/30 text-emerald-300'
      : 'border-rose-500/30 text-rose-300'

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-6 shadow-md z-20">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Droplets size={20} className="text-cyan-400" strokeWidth={2.4} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base font-bold tracking-tight text-white">
                PondPlan
              </h1>
              <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                v2.0 GIS
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">
              Contour-Based Catchment & Pond Optimization
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            <Activity size={14} className="text-emerald-400" />
            <span>Analysis Engine</span>
          </button>
          <button
            onClick={() => setShowMethodology(true)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-slate-200"
          >
            <BookOpen size={14} className="text-slate-400" />
            <span>Hydrology Methodology</span>
          </button>
          <button
            onClick={() => setShowApi(true)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-slate-200"
          >
            <Code2 size={14} className="text-slate-400" />
            <span>API Docs</span>
          </button>
        </nav>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full border bg-slate-900/90 px-3 py-1.5 text-xs font-medium shadow-sm ${statusBorder}`}
          >
            <span className="relative flex h-2 w-2">
              {apiOnline && (
                <span
                  className={`absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-75 animate-ping`}
                />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${statusColor}`} />
            </span>
            <span className="font-mono text-[11px] font-semibold">{statusLabel}</span>
          </div>

          <button
            aria-label="Settings"
            title="System Settings"
            onClick={() => setShowSettings(true)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Settings size={17} />
          </button>
        </div>
      </header>

      <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} />
      <ApiModal isOpen={showApi} onClose={() => setShowApi(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
