import { Waves } from 'lucide-react'
import type { AnalysisResult } from '../types/analysis'

const fmt = (n: number, digits = 2) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: 0 })

export default function SummaryCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="w-64 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur transition-all duration-300 hover:border-slate-600 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Waves size={14} className="text-cyan-400" />
        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-slate-300">
          Site Summary
        </p>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Pond Elevation</span>
          <span className="font-mono font-bold text-white">
            {fmt(result.pond_elevation_m, 0)} m
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Catchment</span>
          <span className="font-mono font-bold text-emerald-400">
            {fmt(result.catchment_area_hectares, 2)} ha
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Water Potential</span>
          <span className="font-mono font-bold text-cyan-300">
            {fmt(result.expected_water_volume_cubic_m, 0)} m³
          </span>
        </div>
      </div>
    </div>
  )
}
