import { useEffect, useState, useCallback } from 'react'
import {
  MapContainer,
  TileLayer,
  ScaleControl,
  LayersControl,
  useMap,
  useMapEvents
} from 'react-leaflet'
import L from 'leaflet'
import { Compass, Maximize2, Minimize2, Crosshair } from 'lucide-react'
import type { AnalysisResult, Coordinate, SelectedArea } from '../types/analysis'
import PondMarker from './PondMarker'
import CatchmentLayer from './CatchmentLayer'
import LandSelector from './LandSelector'
import MapLegend from './MapLegend'

const { BaseLayer } = LayersControl

const DEFAULT_CENTER: [number, number] = [21.2497, 81.2894]

function CoordinateReadout() {
  const [info, setInfo] = useState<{ lat: number; lng: number; zoom: number } | null>(null)

  const map = useMapEvents({
    mousemove: (e) => setInfo({ lat: e.latlng.lat, lng: e.latlng.lng, zoom: map.getZoom() }),
    mouseout: () => setInfo(null),
    zoomend: () => {
      const center = map.getCenter()
      setInfo({ lat: center.lat, lng: center.lng, zoom: map.getZoom() })
    }
  })

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-[400] flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 font-mono text-xs text-slate-300 shadow-lg backdrop-blur">
      <Compass size={13} className="text-cyan-400" />
      {info ? (
        <span>
          {info.lat.toFixed(5)}°N, {info.lng.toFixed(5)}°E · Z{info.zoom}
        </span>
      ) : (
        <span>21.24970°N, 81.28940°E</span>
      )}
    </div>
  )
}

function FitToCatchment({ polygon }: { polygon: Coordinate[] | null }) {
  const map = useMap()

  useEffect(() => {
    if (!polygon || polygon.length === 0) return
    const latlngs = polygon.map(([lon, lat]) => [lat, lon]) as [number, number][]
    map.flyToBounds(L.latLngBounds(latlngs), { padding: [80, 80], duration: 1.2 })
  }, [polygon, map])

  return null
}

function MapControls({ onFitCatchment }: { onFitCatchment?: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div className="absolute right-3 bottom-10 z-[400] flex flex-col gap-2">
      {onFitCatchment && (
        <button
          onClick={onFitCatchment}
          title="Center on Catchment Basin"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 shadow-lg backdrop-blur transition hover:bg-slate-800 hover:text-white"
        >
          <Crosshair size={16} />
        </button>
      )}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 shadow-lg backdrop-blur transition hover:bg-slate-800 hover:text-white"
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  )
}

interface MapViewProps {
  result: AnalysisResult | null
  isSelecting: boolean
  onAreaDrawn: (area: SelectedArea) => void
  clearSignal: number
  onOpenResults: () => void
}

export default function MapView({
  result,
  isSelecting,
  onAreaDrawn,
  clearSignal,
  onOpenResults
}: MapViewProps) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={15}
        className="h-full w-full"
        zoomControl={true}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Esri Topographic">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="Esri Satellite Imagery">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="Esri Street Map">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
        </LayersControl>

        <ScaleControl position="bottomright" imperial={false} />

        <LandSelector
          active={isSelecting}
          onDrawn={onAreaDrawn}
          clearSignal={clearSignal}
        />

        {result && (
          <>
            <CatchmentLayer
              polygon={result.catchment_polygon}
              areaHectares={result.catchment_area_hectares}
              cells={result.total_catchment_cells}
            />
            <PondMarker result={result} onViewDetails={onOpenResults} />
            <FitToCatchment polygon={result.catchment_polygon} />
          </>
        )}

        <CoordinateReadout />
        <MapControls />
      </MapContainer>



      <div className="absolute right-3 top-24 z-[400] hidden md:block">
        <MapLegend showSelection={isSelecting} />
      </div>
    </div>
  )
}
