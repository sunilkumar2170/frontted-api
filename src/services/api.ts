import axios, { AxiosError } from 'axios'
import type { AnalysisResult, ApiErrorShape, Coordinate } from '../types/analysis'

const API_URL = import.meta.env.VITE_API_URL || 'http://10.1.75.53:3213'

const client = axios.create({
  baseURL: API_URL,
  timeout: 120_000
})

function toFriendlyError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ detail?: string }>

    if (err.code === 'ECONNABORTED') {
      return {
        title: 'Analysis timed out',
        detail: 'The terrain model took too long to build. Try a smaller contour map or retry in a moment.'
      }
    }

    if (!err.response) {
      return {
        title: 'Backend unavailable',
        detail: `Could not reach ${API_URL}. Confirm the backend server is running and reachable.`
      }
    }

    const status = err.response.status

    if (status === 400 || status === 422) {
      return {
        title: 'Analysis failed',
        detail: err.response.data?.detail || 'Unable to process this contour map. Please check the file and try again.'
      }
    }

    if (status === 500) {
      return {
        title: 'Server error',
        detail: 'The backend hit an internal error while processing this file.'
      }
    }

    return {
      title: 'Analysis failed',
      detail: `Request failed with status ${status}.`
    }
  }

  return {
    title: 'Unexpected error',
    detail: 'Something went wrong while analyzing the terrain.'
  }
}

export async function analyzeContour(file: File, landBoundary?: Coordinate[]): Promise<AnalysisResult> {
  const form = new FormData()
  form.append('contour_map', file)
  if (landBoundary && landBoundary.length >= 3) {
    form.append('land_boundary', JSON.stringify(landBoundary))
  }

  try {
    const { data } = await client.post<AnalysisResult>('/analyzeContour', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  } catch (error) {
    throw toFriendlyError(error)
  }
}

export function isApiError(value: unknown): value is ApiErrorShape {
  return typeof value === 'object' && value !== null && 'title' in value && 'detail' in value
}

export async function checkHealth(): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.get('/analyzeContour', { timeout: 10_000 })
      if (res.status === 200 || (res.data && !!res.data.message)) {
        return true
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return true
      }
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1000))
      }
    }
  }
  return false
}

export { API_URL }
