import { useState } from 'react'
import { X, Settings, Check, RefreshCw } from 'lucide-react'
import { API_URL, checkHealth } from '../services/api'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  if (!isOpen) return null

  const handleTest = async () => {
    setTesting(true)
    setStatus(null)
    const ok = await checkHealth()
    setTesting(false)
    setStatus(ok ? 'Connected successfully! API is online.' : 'Failed to reach API server.')
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-base-line bg-base p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-base-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-raised text-paper">
              <Settings size={18} />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-paper">System Settings</h2>
              <p className="text-xs text-ink-soft">Environment and backend connectivity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-soft transition hover:bg-base-raised hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-soft">Configured Backend URL</label>
            <input
              type="text"
              readOnly
              value={API_URL}
              className="mt-1.5 w-full rounded-xl border border-base-line bg-base-raised px-3.5 py-2 font-mono text-xs text-paper focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-ink-soft">Configured in .env as VITE_API_URL</p>
          </div>

          <button
            onClick={handleTest}
            disabled={testing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-base-raised py-2.5 text-xs font-medium text-paper transition hover:bg-base-line disabled:opacity-50"
          >
            <RefreshCw size={13} className={testing ? 'animate-spin' : ''} />
            {testing ? 'Testing connection…' : 'Test API Connection'}
          </button>

          {status && (
            <p className={`text-xs text-center font-medium ${status.includes('success') ? 'text-moss-400' : 'text-rose-400'}`}>
              {status}
            </p>
          )}
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
