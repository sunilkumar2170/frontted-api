import { Polygon, Tooltip, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import type { Coordinate } from '../types/analysis'

interface CatchmentLayerProps {
  polygon: Coordinate[]
  areaHectares?: number
  cells?: number
}

const fmt = (n: number, digits = 2) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: 0 })

export default function CatchmentLayer({ polygon, areaHectares, cells }: CatchmentLayerProps) {
  if (!polygon || polygon.length === 0) return null

  // Backend returns [lon, lat]; Leaflet wants [lat, lon].
  const positions: LatLngExpression[] = polygon.map(([lon, lat]) => [lat, lon])

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: '#10B981',
        weight: 2.5,
        opacity: 0.95,
        fillColor: '#059669',
        fillOpacity: 0.3,
        dashArray: '4, 4'
      }}
    >
      <Tooltip sticky direction="top">
        <div className="font-sans text-xs font-semibold text-slate-900">
          Catchment Basin
          {areaHectares !== undefined && (
            <span className="block text-[11px] font-normal text-slate-600">
              Area: {fmt(areaHectares, 2)} ha
            </span>
          )}
        </div>
      </Tooltip>
      <Popup>
        <div className="p-1 font-sans text-xs">
          <p className="font-bold text-slate-900 text-sm">Catchment Basin</p>
          <div className="mt-2 space-y-1 text-slate-700">
            {areaHectares !== undefined && (
              <p>
                Area: <span className="font-bold text-emerald-700">{fmt(areaHectares, 2)} ha</span>
              </p>
            )}
            {cells !== undefined && (
              <p>
                Cells: <span className="font-semibold text-slate-900">{cells} cells</span>
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Polygon>
  )
}
