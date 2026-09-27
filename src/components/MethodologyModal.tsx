import { X, Layers } from 'lucide-react'

interface MethodologyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base-line bg-base p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-base-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-moss-500/20 text-moss-400">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-paper">Catchment & Pond Analysis Methodology</h2>
              <p className="text-xs text-ink-soft">Scientific pipeline for automated rural water planning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-soft transition hover:bg-base-raised hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs leading-relaxed text-ink-soft">
          <div className="rounded-xl border border-base-line bg-base-raised p-4">
            <div className="flex items-center gap-2 text-paper font-semibold text-sm mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tide-500/20 text-tide-400 text-xs">1</span>
              DEM Construction & Grid Interpolation
            </div>
            <p>
              Extracts 3D contour polyline coordinates and elevation levels from uploaded KML/KMZ files. Uses SciPy's Delaunay triangulation-based interpolation to construct a continuous 2D Digital Elevation Model (DEM) grid.
            </p>
          </div>

          <div className="rounded-xl border border-base-line bg-base-raised p-4">
            <div className="flex items-center gap-2 text-paper font-semibold text-sm mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tide-500/20 text-tide-400 text-xs">2</span>
              Optimal Pond Siting (Local Minima Detection)
            </div>
            <p>
              Scans DEM grid cells with a spatial margin filter to detect natural topographic depressions (local minima). Selects the lowest depression point as the primary pond outlet candidate.
            </p>
          </div>

          <div className="rounded-xl border border-base-line bg-base-raised p-4">
            <div className="flex items-center gap-2 text-paper font-semibold text-sm mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tide-500/20 text-tide-400 text-xs">3</span>
              D8 Flow Direction & Catchment Delineation
            </div>
            <p>
              Computes steepest-descent flow vectors across all 8 cardinal neighbors (D8 algorithm). Traces reverse drainage paths starting from the pond outlet upward to identify all contributing grid cells and constructs the boundary GeoJSON polygon.
            </p>
          </div>

          <div className="rounded-xl border border-base-line bg-base-raised p-4">
            <div className="flex items-center gap-2 text-paper font-semibold text-sm mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tide-500/20 text-tide-400 text-xs">4</span>
              Live Rainfall & SCS Runoff Volume Estimation
            </div>
            <p>
              Queries live open meteorological precipitation data for the exact site coordinates. Calculates net runoff depth using the USDA Soil Conservation Service (SCS) Curve Number method:
            </p>
            <div className="mt-2 rounded-lg bg-base px-3 py-2 font-mono text-[11px] text-moss-300">
              S = (25400 / CN) - 254 | Q = (P - 0.2*S)² / (P + 0.8*S) | V = Q × Area
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-moss-500 to-tide-500 px-5 py-2 text-xs font-semibold text-base transition hover:opacity-90"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  )
}
