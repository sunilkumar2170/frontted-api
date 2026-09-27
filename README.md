# PondPlan — Catchment Analysis Frontend

A React + TypeScript frontend for the Village Pond Planning / Catchment
Analysis backend. Upload a contour map (KML/KMZ), and the app renders the
suggested pond location, catchment polygon, and expected water volume on an
interactive map.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Leaflet + React-Leaflet + Leaflet-Draw (land area selection)
- Axios

## Setup

```bash
npm install
cp .env.example .env
# edit .env if your backend URL is different
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment

`VITE_API_URL` — base URL of the backend (no trailing slash), e.g.:

```
VITE_API_URL=http://10.1.75.53:3213
```

The app never hard-codes a host — every request goes through this variable
via `src/services/api.ts`.

## Backend contract

`POST {VITE_API_URL}/analyzeContour`, `multipart/form-data`, field name
`contour_map`. Expected JSON response shape is typed in
`src/types/analysis.ts` and matches:

```json
{
  "filename": "contours_1m.kml",
  "pond_location": { "longitude": 81.289, "latitude": 21.249 },
  "pond_elevation_m": 267.0,
  "catchment_area_hectares": 15.17,
  "total_catchment_cells": 85,
  "catchment_polygon": [[81.287, 21.249], ["..."]],
  "rainfall_used_mm": 1382.66,
  "curve_number_used": 60.0,
  "runoff_depth_mm": 1198.35,
  "expected_water_volume_cubic_m": 181766.14
}
```

## Land area selection

The "Select Land Area" control enables polygon drawing on the map
(Leaflet-Draw). The drawn polygon and its area are held in app state
(`selectedArea` in `App.tsx`) and are ready to be sent to the backend as an
extra parameter once that endpoint exists — nothing on the current
`/analyzeContour` call depends on it.

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/     UI building blocks (map, panels, cards, toasts)
├── services/api.ts   axios wrapper + error normalization
├── types/analysis.ts  API response contract
├── hooks/useToast.ts
├── App.tsx
└── main.tsx
```
