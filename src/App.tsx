import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import UploadPanel from './components/UploadPanel'
import ResultsPanel from './components/ResultsPanel'
import SummaryCard from './components/SummaryCard'
import LandAreaControl from './components/LandAreaControl'
import MobileResultsSheet from './components/MobileResultsSheet'
import LoadingOverlay from './components/LoadingOverlay'
import Toast from './components/Toast'
import { analyzeContour, checkHealth, isApiError } from './services/api'
import { useToast } from './hooks/useToast'
import type { AnalysisResult, SelectedArea } from './types/analysis'

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [apiOnline, setApiOnline] = useState<boolean | null>(true)

  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null)
  const [clearSignal, setClearSignal] = useState(0)

  const { toasts, dismiss, push } = useToast()

  useEffect(() => {
    checkHealth().then(setApiOnline)
    const id = window.setInterval(() => {
      checkHealth().then(setApiOnline)
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const handleAnalyze = useCallback(
    async (file: File) => {
      setIsAnalyzing(true)
      try {
        const boundary = selectedArea ? selectedArea.polygon : undefined
        const data = await analyzeContour(file, boundary)
        setResult(data)
        push(
          'success',
          'Analysis complete',
          boundary
            ? `Pond & catchment optimized for selected land parcel (${selectedArea!.areaHectares.toFixed(2)} ha).`
            : `Catchment of ${data.catchment_area_hectares.toFixed(2)} ha identified.`
        )
      } catch (error) {
        if (isApiError(error)) {
          push('error', error.title, error.detail)
        } else {
          push('error', 'Analysis failed', 'Unable to process this contour map. Please check the file and try again.')
        }
      } finally {
        setIsAnalyzing(false)
      }
    },
    [push, selectedArea]
  )

  const handleAreaDrawn = useCallback((area: SelectedArea) => {
    setSelectedArea(area)
    setIsSelecting(false)
  }, [])

  const handleConfirmArea = useCallback(() => {
    if (selectedArea) {
      push('info', 'Land area confirmed', `${selectedArea.areaHectares.toFixed(2)} ha selected for analysis constraint.`)
    }
  }, [selectedArea, push])

  const handleClearArea = useCallback(() => {
    setSelectedArea(null)
    setClearSignal((c) => c + 1)
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 font-body">
      <Header apiOnline={apiOnline} />

      <main className="relative flex-1 overflow-hidden">
        <MapView
          result={result}
          isSelecting={isSelecting}
          onAreaDrawn={handleAreaDrawn}
          clearSignal={clearSignal}
          onOpenResults={() => {}}
        />

        {/* Left Side: Upload & Land Boundary Controls */}
        <div className="pointer-events-none absolute left-4 top-4 z-[450] flex flex-col gap-3">
          <div className="pointer-events-auto flex flex-col gap-3">
            <UploadPanel
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              compact={!!result}
              selectedArea={selectedArea}
            />
            <LandAreaControl
              isSelecting={isSelecting}
              onToggle={() => setIsSelecting((v) => !v)}
              selectedArea={selectedArea}
              onConfirm={handleConfirmArea}
              onClear={handleClearArea}
            />
          </div>
        </div>

        {/* Bottom Left: HUD Summary when result is available */}
        {result && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-[450] hidden xl:block">
            <div className="pointer-events-auto">
              <SummaryCard result={result} />
            </div>
          </div>
        )}

        {/* Right Side: Detailed Results Panel */}
        {result && (
          <div className="pointer-events-none absolute top-4 right-4 z-[450] hidden md:block max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="pointer-events-auto">
              <ResultsPanel result={result} />
            </div>
          </div>
        )}

        {/* Mobile View: Bottom Sheet */}
        {result && (
          <div className="absolute inset-x-0 bottom-0 z-[450] md:hidden">
            <MobileResultsSheet result={result} />
          </div>
        )}

        {isAnalyzing && <LoadingOverlay />}
      </main>

      <Toast toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
