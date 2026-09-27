export interface PondLocation {
  longitude: number
  latitude: number
}

// [lon, lat] pairs, matching the GeoJSON-style order the backend returns
export type Coordinate = [number, number]

export interface AnalysisResult {
  filename: string
  pond_location: PondLocation
  pond_elevation_m: number
  catchment_area_hectares: number
  total_catchment_cells: number
  catchment_polygon: Coordinate[]
  rainfall_used_mm: number
  curve_number_used: number
  runoff_depth_mm: number
  expected_water_volume_cubic_m: number
}

export type AnalysisStage =
  | 'reading'
  | 'terrain'
  | 'catchment'
  | 'runoff'
  | 'done'

export interface SelectedArea {
  polygon: Coordinate[]
  areaHectares: number
  centroid?: {
    latitude: number
    longitude: number
  }
  placeName?: string
}

export interface ApiErrorShape {
  title: string
  detail: string
}
