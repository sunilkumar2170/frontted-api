import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Coordinate, SelectedArea } from '../types/analysis'

interface LandSelectorProps {
  active: boolean
  onDrawn: (area: SelectedArea) => void
  clearSignal: number
}

// Spherical geodesic polygon area calculation in hectares (WGS84 ellipsoid model)
function calculateGeodesicAreaHectares(coords: Coordinate[]): number {
  if (coords.length < 3) return 0
  const R = 6378137 // Earth radius in meters
  let area = 0
  const len = coords.length
  for (let i = 0; i < len; i++) {
    const p1 = coords[i]
    const p2 = coords[(i + 1) % len]
    const lon1 = (p1[0] * Math.PI) / 180
    const lat1 = (p1[1] * Math.PI) / 180
    const lon2 = (p2[0] * Math.PI) / 180
    const lat2 = (p2[1] * Math.PI) / 180
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2))
  }
  area = (Math.abs(area) * R * R) / 2
  return area / 10000 // Convert m² to hectares
}

// Calculate centroid of polygon coordinates
function calculateCentroid(coords: Coordinate[]): { latitude: number; longitude: number } {
  let sumLon = 0
  let sumLat = 0
  const n = coords.length
  for (const [lon, lat] of coords) {
    sumLon += lon
    sumLat += lat
  }
  return {
    latitude: sumLat / n,
    longitude: sumLon / n
  }
}

// Free reverse geocoding via OpenStreetMap Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      }
    )
    clearTimeout(timeout)
    if (!res.ok) return 'Selected Terrain'
    const data = await res.json()
    const addr = data.address || {}
    const place =
      addr.village ||
      addr.suburb ||
      addr.town ||
      addr.hamlet ||
      addr.city ||
      addr.county ||
      'Local Land Parcel'
    const state = addr.state || ''
    return state ? `${place}, ${state}` : place
  } catch {
    return 'Selected Land Parcel'
  }
}

export default function LandSelector({ active, onDrawn, clearSignal }: LandSelectorProps) {
  const map = useMap()
  const groupRef = useRef<L.FeatureGroup | null>(null)
  const isDrawingRef = useRef(false)
  const pointsRef = useRef<L.LatLng[]>([])
  const tempLineRef = useRef<L.Polyline | null>(null)

  // Initialize group for drawing layers
  useEffect(() => {
    const group = new L.FeatureGroup()
    map.addLayer(group)
    groupRef.current = group

    return () => {
      map.removeLayer(group)
    }
  }, [map])

  // Clear layers on clear signal
  useEffect(() => {
    groupRef.current?.clearLayers()
    if (tempLineRef.current) {
      map.removeLayer(tempLineRef.current)
      tempLineRef.current = null
    }
    pointsRef.current = []
    isDrawingRef.current = false
  }, [clearSignal, map])

  // Freehand Lasso Drawing Logic
  useEffect(() => {
    const container = map.getContainer()

    if (!active) {
      container.style.cursor = ''
      map.dragging.enable()
      return
    }

    container.style.cursor = 'crosshair'
    map.dragging.disable()

    const onMouseDown = (e: L.LeafletMouseEvent) => {
      // Start freehand path
      isDrawingRef.current = true
      pointsRef.current = [e.latlng]
      groupRef.current?.clearLayers()

      if (tempLineRef.current) {
        map.removeLayer(tempLineRef.current)
      }

      tempLineRef.current = L.polyline([e.latlng], {
        color: '#F59E0B',
        weight: 3,
        dashArray: '4, 4',
        opacity: 0.95
      }).addTo(map)
    }

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      if (!isDrawingRef.current || !tempLineRef.current) return

      const pts = pointsRef.current
      const last = pts[pts.length - 1]

      // Distance threshold to avoid bloated point arrays
      const dist = map.latLngToLayerPoint(last).distanceTo(map.latLngToLayerPoint(e.latlng))
      if (dist >= 6) {
        pts.push(e.latlng)
        tempLineRef.current.setLatLngs(pts)
      }
    }

    const onMouseUp = async (e: L.LeafletMouseEvent) => {
      if (!isDrawingRef.current) return
      isDrawingRef.current = false

      const pts = pointsRef.current
      if (tempLineRef.current) {
        map.removeLayer(tempLineRef.current)
        tempLineRef.current = null
      }

      if (pts.length < 3) {
        pointsRef.current = []
        return
      }

      // Convert LatLngs to GeoJSON Coordinate pairs [lon, lat]
      const polygonCoords: Coordinate[] = pts.map((pt) => [pt.lng, pt.lat])
      // Ensure closed loop
      if (
        polygonCoords[0][0] !== polygonCoords[polygonCoords.length - 1][0] ||
        polygonCoords[0][1] !== polygonCoords[polygonCoords.length - 1][1]
      ) {
        polygonCoords.push([polygonCoords[0][0], polygonCoords[0][1]])
      }

      // Calculate area and centroid
      const areaHectares = calculateGeodesicAreaHectares(polygonCoords)
      const centroid = calculateCentroid(polygonCoords)

      // Draw final smooth polygon on map
      const latlngs = polygonCoords.map(([lon, lat]) => [lat, lon] as [number, number])
      const poly = L.polygon(latlngs, {
        color: '#F59E0B',
        weight: 2.5,
        fillColor: '#F59E0B',
        fillOpacity: 0.22,
        dashArray: '3, 3'
      })

      groupRef.current?.clearLayers()
      poly.addTo(groupRef.current!)

      // Fetch place name via Nominatim
      const placeName = await reverseGeocode(centroid.latitude, centroid.longitude)

      // Attach tooltip to polygon
      poly.bindTooltip(
        `<div class="font-sans text-xs">
          <strong>${placeName}</strong><br/>
          Area: ${areaHectares.toFixed(2)} ha<br/>
          Center: ${centroid.latitude.toFixed(4)}, ${centroid.longitude.toFixed(4)}
        </div>`,
        { sticky: true }
      )

      // Send to parent state
      onDrawn({
        polygon: polygonCoords,
        areaHectares,
        centroid,
        placeName
      })

      // Re-enable map dragging
      map.dragging.enable()
      container.style.cursor = ''
    }

    map.on('mousedown', onMouseDown)
    map.on('mousemove', onMouseMove)
    map.on('mouseup', onMouseUp)

    return () => {
      map.off('mousedown', onMouseDown)
      map.off('mousemove', onMouseMove)
      map.off('mouseup', onMouseUp)
      map.dragging.enable()
      container.style.cursor = ''
      if (tempLineRef.current) {
        map.removeLayer(tempLineRef.current)
        tempLineRef.current = null
      }
    }
  }, [active, map, onDrawn])

  return null
}
