import { useCallback, useRef, useState } from 'react'
import { UploadCloud, FileText, X, Loader2, Sparkles, Map, Crosshair } from 'lucide-react'
import type { SelectedArea } from '../types/analysis'

interface UploadPanelProps {
  onAnalyze: (file: File) => void
  isAnalyzing: boolean
  compact: boolean
  selectedArea?: SelectedArea | null
}

const ACCEPTED = ['.kml', '.kmz']

function isAcceptedFile(file: File) {
  const name = file.name.toLowerCase()
  return ACCEPTED.some((ext) => name.endsWith(ext))
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadPanel({
  onAnalyze,
  isAnalyzing,
  compact,
  selectedArea
}: UploadPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptFile = useCallback((candidate: File) => {
    if (!isAcceptedFile(candidate)) {
      setFileError('Only .kml or .kmz contour files are supported.')
      return
    }
    setFileError(null)
    setFile(candidate)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files?.[0]
      if (dropped) acceptFile(dropped)
    },
    [acceptFile]
  )

  return (
    <div
      className={`w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl backdrop-blur transition-all duration-300 ${
        compact ? 'max-w-xs p-4' : ''
      }`}
    >
      <div className="mb-3.5 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Map size={15} />
          </div>
          <h2 className="font-display text-sm font-bold tracking-tight text-white">
            Terrain Input
          </h2>
        </div>
        <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
          KML / KMZ
        </span>
      </div>

      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-all ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : 'border-slate-700 bg-slate-800/50 hover:border-cyan-400/60 hover:bg-slate-800/80'
          }`}
        >
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
            <UploadCloud size={24} strokeWidth={1.8} />
          </div>
          <p className="text-sm font-semibold text-slate-100">Upload Contour Map</p>
          <p className="mt-1 text-xs text-slate-400">
            Drag & drop or <span className="font-medium text-cyan-400 underline underline-offset-2">browse</span>
          </p>
          <p className="mt-2 text-[10px] text-slate-400">
            Supports 1m / 2m / 5m elevation contours
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".kml,.kmz"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0]
              if (picked) acceptFile(picked)
            }}
          />
        </div>
      )}

      {fileError && (
        <div className="mt-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-2 text-xs font-medium text-rose-400">
          {fileError}
        </div>
      )}

      {file && (
        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <FileText size={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{file.name}</p>
              <p className="text-[11px] font-mono text-slate-400">
                {formatBytes(file.size)} · {file.name.split('.').pop()?.toUpperCase()}
              </p>
            </div>
          </div>
          {!isAnalyzing && (
            <button
              aria-label="Remove file"
              onClick={() => setFile(null)}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {selectedArea && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300">
          <Crosshair size={13} className="shrink-0 text-amber-400" />
          <span>Restricted to drawn land boundary ({selectedArea.areaHectares.toFixed(2)} ha)</span>
        </div>
      )}

      <button
        disabled={!file || isAnalyzing}
        onClick={() => file && onAnalyze(file)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-400 disabled:shadow-none"
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={16} className="animate-spin text-slate-900" />
            <span>Computing D8 Flow & Catchment…</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>{selectedArea ? 'Analyze Selected Land Parcel' : 'Analyze Terrain'}</span>
          </>
        )}
      </button>
    </div>
  )
}
