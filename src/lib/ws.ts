import { useConnectionStore } from '@/store/connection'

export function createWS(
  path: string,
  onMessage: (msg: Record<string, unknown>) => void,
  onClose?: () => void,
): WebSocket {
  const { apiUrl, token } = useConnectionStore.getState()
  const base = apiUrl || window.location.origin
  const wsBase = base.replace(/^http/, 'ws')
  const url = new URL(path, wsBase)
  if (token) url.searchParams.set('token', token)

  const ws = new WebSocket(url.toString())
  ws.onmessage = (e) => {
    try {
      onMessage(JSON.parse(e.data))
    } catch { /* ignore non-JSON */ }
  }
  ws.onclose = () => onClose?.()
  ws.onopen = () => useConnectionStore.getState().setConnected(true)
  ws.onerror = () => useConnectionStore.getState().setConnected(false)

  return ws
}
