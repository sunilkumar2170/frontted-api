import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { Droplets } from 'lucide-react'
import type { AnalysisResult } from '../types/analysis'

function buildPondIcon() {
  const html = renderToStaticMarkup(
    <div className="relative flex h-10 w-10 items-center justify-center">
      <span className="absolute inline-flex h-9 w-9 animate-ping rounded-full bg-cyan-400 opacity-60" />
      <span className="absolute inline-flex h-6 w-6 animate-pulse rounded-full bg-cyan-500/40" />
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-cyan-500 shadow-xl">
        <Droplets size={11} color="white" strokeWidth={2.8} />
      </span>
    </div>
  )

  return L.divIcon({
    html,
    className: 'custom-pond-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
}

interface PondMarkerProps {
  result: AnalysisResult
  onViewDetails?: () => void
}

const fmt = (n: number, digits = 1) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: 0 })

export default function PondMarker({ result }: PondMarkerProps) {
  const { latitude, longitude } = result.pond_location

  return (
    <Marker position={[latitude, longitude]} icon={buildPondIcon()}>
      <Popup className="gis-popup">
        <div className="min-w-[180px] p-1 font-sans">
          <p className="font-bold text-slate-900 text-sm">Suggested Pond Site</p>

          <div className="mt-2 space-y-1 text-xs text-slate-700">
            <p>
              Elevation: <span className="font-bold text-slate-900">{fmt(result.pond_elevation_m, 0)} m</span>
            </p>
            <p>
              Catchment: <span className="font-bold text-emerald-700">{fmt(result.catchment_area_hectares, 2)} ha</span>
            </p>
            <p>
              Coordinates: <span className="font-mono text-[11px] text-slate-600">{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
