import { CheckCircle2, Mountain, Layers, CloudRain, TrendingUp, Sigma, Download, MapPin, Gauge } from 'lucide-react'
import type { AnalysisResult } from '../types/analysis'
import MetricCard from './MetricCard'

interface ResultsPanelProps {
  result: AnalysisResult
  onClose?: () => void
}

const fmt = (n: number, digits = 2) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: 0 })

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const coordString = `${result.pond_location.latitude.toFixed(5)}, ${result.pond_location.longitude.toFixed(5)}`

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `catchment_analysis_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl backdrop-blur animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-white">
            Pond Analysis
          </h2>
          <p className="mt-0.5 max-w-[200px] truncate text-xs font-mono text-slate-400">
            {result.filename}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 shadow-sm">
          <CheckCircle2 size={12} />
          <span className="text-[11px] font-semibold">Complete</span>
        </div>
      </div>

      {/* Hero Metric: Expected Water Volume */}
      <div className="mt-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-emerald-950/40 p-4 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sigma size={16} strokeWidth={2.4} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Expected Water Volume
          </p>
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-extrabold tracking-tight text-cyan-300">
            {fmt(result.expected_water_volume_cubic_m, 0)}
          </span>
          <span className="font-display text-xs font-bold text-cyan-400">m³</span>
          <span className="ml-auto text-[11px] font-medium text-slate-400">
            ({(result.expected_water_volume_cubic_m / 10000).toFixed(2)} Ha-m)
          </span>
        </div>
      </div>

      {/* Grid of Compact Engineering Metrics */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <MetricCard
          icon={Layers}
          label="Catchment Area"
          value={fmt(result.catchment_area_hectares, 2)}
          unit="ha"
          footnote={`${result.total_catchment_cells} cells`}
          accent="moss"
        />
        <MetricCard
          icon={Mountain}
          label="Pond Elevation"
          value={fmt(result.pond_elevation_m, 0)}
          unit="m"
          accent="neutral"
        />
        <MetricCard
          icon={CloudRain}
          label="Rainfall"
          value={fmt(result.rainfall_used_mm, 1)}
          unit="mm"
          accent="tide"
        />
        <MetricCard
          icon={TrendingUp}
          label="Runoff Depth"
          value={fmt(result.runoff_depth_mm, 1)}
          unit="mm"
          accent="neutral"
        />
        <MetricCard
          icon={Gauge}
          label="Curve Number"
          value={fmt(result.curve_number_used, 0)}
          accent="amber"
        />
        <MetricCard
          icon={MapPin}
          label="Coordinates"
          value={coordString}
          accent="tide"
          copyableText={coordString}
        />
      </div>

      {/* Footer Actions */}
      <div className="mt-3.5 pt-1">
        <button
          onClick={handleExportJson}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
        >
          <Download size={13} />
          Export JSON Report
        </button>
      </div>
    </div>
  )
}
