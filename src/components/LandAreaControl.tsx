import { Pencil, Check, Trash2, Crosshair, MapPin, Compass } from 'lucide-react'
import type { SelectedArea } from '../types/analysis'

interface LandAreaControlProps {
  isSelecting: boolean
  onToggle: () => void
  selectedArea: SelectedArea | null
  onConfirm: () => void
  onClear: () => void
}

export default function LandAreaControl({
  isSelecting,
  onToggle,
  selectedArea,
  onConfirm,
  onClear
}: LandAreaControlProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl backdrop-blur transition-all">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Crosshair size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">Freehand Land Boundary</span>
        </div>
        {selectedArea && (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
            {selectedArea.areaHectares.toFixed(2)} ha
          </span>
        )}
      </div>

      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
          isSelecting
            ? 'border border-amber-400/60 bg-amber-500/25 text-amber-300 shadow-md animate-pulse'
            : 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700'
        }`}
      >
        <Pencil size={14} />
        {isSelecting ? 'Mouse dabao, ghumao aur chhodo...' : 'Lasso Draw Boundary (Drag to select)'}
      </button>

      {isSelecting && !selectedArea && (
        <p className="mt-2 text-center text-[11px] text-amber-400/90">
          💡 Map par mouse hold karke cursor ghumayein aur chhod dein — shape automatically ban jayega!
        </p>
      )}

      {selectedArea && (
        <div className="mt-3 space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          {/* Place Name via Reverse Geocoding */}
          {selectedArea.placeName && (
            <div className="flex items-start gap-1.5 border-b border-slate-800/80 pb-2">
              <MapPin size={13} className="mt-0.5 shrink-0 text-amber-400" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location</p>
                <p className="truncate text-xs font-semibold text-slate-100">{selectedArea.placeName}</p>
              </div>
            </div>
          )}

          {/* Area & Centroid Coordinates */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Selected Area</p>
              <p className="font-mono text-xs font-bold text-amber-400">
                {selectedArea.areaHectares.toFixed(2)} ha
              </p>
            </div>
            {selectedArea.centroid && (
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Centroid</p>
                <p className="font-mono text-[11px] font-semibold text-slate-300 truncate">
                  {selectedArea.centroid.latitude.toFixed(4)}°, {selectedArea.centroid.longitude.toFixed(4)}°
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={onConfirm}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/30"
            >
              <Check size={13} />
              <span>Apply Boundary</span>
            </button>
            <button
              onClick={onClear}
              title="Clear selection"
              className="flex items-center justify-center rounded-lg bg-slate-800 px-3 py-1.5 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
