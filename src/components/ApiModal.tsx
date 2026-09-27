import { X, Terminal, Code2 } from 'lucide-react'
import { API_URL } from '../services/api'

interface ApiModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiModal({ isOpen, onClose }: ApiModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base-line bg-base p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-base-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tide-500/20 text-tide-400">
              <Code2 size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-paper">API Reference & Endpoints</h2>
              <p className="text-xs text-ink-soft">Production Endpoint · {API_URL}</p>
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
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-paper">
              <span className="rounded bg-moss-500/20 px-2 py-0.5 text-xs text-moss-400">POST</span>
              <span>/analyzeContour</span>
            </div>
            <p className="mt-2">
              Accepts multipart/form-data upload of a KML or KMZ contour map and returns structured catchment analytics.
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-paper font-medium mb-1">
                <Terminal size={12} className="text-tide-400" />
                <span>Sample cURL Command</span>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-base p-3 font-mono text-[11px] text-tide-300">
{`curl -X POST "${API_URL}/analyzeContour" \\
  -F "contour_map=@contours_1m.kml"`}
              </pre>
            </div>
          </div>

          <div className="rounded-xl border border-base-line bg-base-raised p-4">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-paper">
              <span className="rounded bg-tide-500/20 px-2 py-0.5 text-xs text-tide-400">GET</span>
              <span>/analyzeContour</span>
            </div>
            <p className="mt-2">
              Liveness & health check probe verifying API server operational readiness.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-moss-500 to-tide-500 px-5 py-2 text-xs font-semibold text-base transition hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
