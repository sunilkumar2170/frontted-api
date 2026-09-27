import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { AnalysisResult } from '../types/analysis'
import ResultsPanel from './ResultsPanel'

export default function MobileResultsSheet({ result }: { result: AnalysisResult }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-t-2xl border-t border-base-line bg-paper shadow-float">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <div className="text-left">
          <p className="text-xs font-semibold text-ink-soft">Catchment area</p>
          <p className="font-display text-sm font-semibold text-ink">
            {result.catchment_area_hectares.toFixed(2)} ha ·{' '}
            {Math.round(result.expected_water_volume_cubic_m).toLocaleString('en-IN')} m³
          </p>
        </div>
        {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>
      {expanded && (
        <div className="max-h-[60vh] overflow-y-auto px-5 pb-5">
          <ResultsPanel result={result} />
        </div>
      )}
    </div>
  )
}
