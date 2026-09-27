interface MapLegendProps {
  showSelection: boolean
}

export default function MapLegend({ showSelection }: MapLegendProps) {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 text-xs text-slate-200 shadow-xl backdrop-blur">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        GIS Map Layers
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          </span>
          <span className="font-medium text-slate-300">Optimal Pond Siting</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded border border-emerald-400 bg-emerald-500/40" />
          <span className="font-medium text-slate-300">Catchment Basin</span>
        </div>
        {showSelection && (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-dashed border-amber-400 bg-amber-400/20" />
            <span className="font-medium text-amber-300">Land Boundary Filter</span>
          </div>
        )}
      </div>
    </div>
  )
}
