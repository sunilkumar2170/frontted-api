# 🌊 Village Pond Planning System — React GIS Frontend

An interactive, high-performance Web-GIS application built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Leaflet**. Designed for real-time village pond siting, contour-based elevation analysis, freehand land boundary selection, and hydrological catchment visualization.

---

## 🚀 Live Demo & Deployment

- **Frontend Application**: [http://10.1.75.53:4213/](http://10.1.75.53:4213/)
- **Backend REST API**: [http://10.1.75.53:3213/](http://10.1.75.53:3213/)
- **API Documentation**: [http://10.1.75.53:3213/docs](http://10.1.75.53:3213/docs)

---

## ✨ Key Features

- **🗺️ Interactive GIS Map View**: Multi-layer map tiles (OpenStreetMap, ArcGIS Topo, Satellite Imagery) with smooth panning, zooming, and full-screen support.
- **✏️ Freehand Lasso Boundary Tool**: Custom mouse-down drag-to-draw tool allowing users to draw custom land parcel boundaries directly on the interactive map.
- **📂 KML / KMZ Contour Upload**: Drag-and-drop file upload supporting `.kml` and `.kmz` contour datasets.
- **⛰️ Automatic Pond Siting**: Highlights optimal low-elevation candidate pond sites on the elevation grid.
- **🌧️ Hydrological Catchment & Runoff Delineation**: Renders upstream catchment basins and calculates net rainwater storage volume ($m^3$) using SCS Curve Number (SCS-CN) hydrology.
- **⚡ Dynamic API Fallback**: Automatically connects to the host machine (`window.location.hostname:3213`) or environment-defined backend URL.
- **⏱️ Non-Blocking Health Monitoring**: Optimistic status indicators and automatic server health checks.

---

## 🛠️ Tech Stack & Frameworks

| Technology | Purpose |
| :--- | :--- |
| **React 18** | UI Framework & Component Lifecycle |
| **TypeScript** | Strict Type Checking & API Contract Typing |
| **Vite** | Lightning-Fast HMR & Production Bundler |
| **Tailwind CSS** | Modern Responsive UI Styling |
| **Leaflet & React-Leaflet** | Interactive Mapping Engine & Vector Layer Rendering |
| **Axios** | HTTP Client with Dynamic Base URL Resolution |
| **Lucide React** | Clean UI Vector Icons |

---

## 📁 Project Architecture

```
pondplan/
├── src/
│   ├── components/
│   │   ├── LandSelector.tsx     # Freehand Lasso & Polygon Drawing Engine
│   │   ├── MapView.tsx          # Leaflet Tile & Layer Controls
│   │   ├── ResultsPanel.tsx     # Hydrological Dashboard Card
│   │   ├── SettingsModal.tsx    # API & Connectivity Configuration
│   │   ├── Header.tsx           # Navigation & Server Health Badge
│   │   └── FileUpload.tsx       # Drag-and-Drop KML/KMZ File Input
│   ├── services/
│   │   └── api.ts               # Axios API client with dynamic hostname detection
│   ├── types/
│   │   └── analysis.ts          # TypeScript interfaces for API contracts
│   ├── App.tsx                  # Main Application Layout & State Management
│   └── main.tsx                 # React App Entry Point
├── public/                      # Static Assets & Icons
├── dist/                        # Production Build Bundle
├── package.json
└── vite.config.ts
```

---

## 💻 Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sunilkumar2170/frontted-api.git
   cd frontted-api/pondplan
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The local frontend will be running at `http://localhost:5173`.

---

## 📦 Production Build

To build the static production bundle served by the FastAPI / SPA server:

```bash
npm run build
```

The optimized static files will be generated inside `dist/`.

---

## 🔄 API Integration Contract

### Endpoint: `POST /analyzeContour`

- **Content-Type**: `multipart/form-data`
- **Request Parameters**:
  - `contour_map`: KML/KMZ File (`.kml` / `.kmz`)
  - `land_boundary` *(optional)*: JSON stringified coordinates `[[lon, lat], ...]`

### Sample API Response JSON:

```json
{
  "filename": "contours_1m.kml",
  "pond_location": {
    "longitude": 81.2894,
    "latitude": 21.2497
  },
  "pond_elevation_m": 267.0,
  "catchment_area_hectares": 15.17,
  "total_catchment_cells": 85,
  "catchment_polygon": [
    [81.2871, 21.2491],
    [81.2885, 21.2505]
  ],
  "rainfall_used_mm": 1100.0,
  "curve_number_used": 60.0,
  "runoff_depth_mm": 920.0,
  "expected_water_volume_cubic_m": 139548.0
}
```


