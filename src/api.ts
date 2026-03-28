const BASE = import.meta.env.VITE_API_URL ?? ''

function authHeaders(): Record<string, string> {
  const token = new URLSearchParams(window.location.search).get('token')
  if (token) return { Authorization: `Bearer ${token}` }
  return {}
}

function wsUrl(path: string): string {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const base = BASE || `${proto}//${window.location.host}`
  const url = new URL(path, base.replace(/^http/, 'ws'))
  const token = new URLSearchParams(window.location.search).get('token')
  if (token) url.searchParams.set('token', token)
  return url.toString()
}

export async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `${res.status} ${res.statusText}`)
  }
  return res.json()
}

export function openWS(
  path: string,
  onMessage: (data: Record<string, unknown>) => void,
  onClose?: () => void,
): WebSocket {
  const ws = new WebSocket(wsUrl(path))
  ws.onmessage = (e) => {
    try {
      onMessage(JSON.parse(e.data))
    } catch { /* ignore non-JSON */ }
  }
  ws.onclose = () => onClose?.()
  return ws
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
