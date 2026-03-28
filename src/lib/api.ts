import { useConnectionStore } from '@/store/connection'

function getBase(): string {
  return useConnectionStore.getState().apiUrl || ''
}

function getHeaders(): Record<string, string> {
  const { token } = useConnectionStore.getState()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, { headers: getHeaders() })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `${res.status} ${res.statusText}`)
  }
  return res.json()
}

// Types matching the claw API spec

export interface Driver {
  arch: string
  arch_version: string
  driver_version: string
  driver_type: string
  path: string
}

export interface Instance {
  id: string
  arch: string
  group: string
  folder: string
  jid: string
  state: string
  age: string
  is_main: boolean
}

export interface HealthCheck {
  name: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  remediation?: string
}

export interface Installation {
  arch: string
  source_dir: string
  checks: HealthCheck[]
  summary: { pass: number; warn: number; fail: number }
  overall: string
}

export interface Group {
  arch: string
  source_dir: string
  jid: string
  name: string
  folder: string
  trigger: string
  is_main: boolean
  requires_trigger: boolean
}

export interface Session {
  session_id: string
  group: string
  started_at: string
  last_active: string
  message_count: number
  summary: string
}
