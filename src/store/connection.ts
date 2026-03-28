import { create } from 'zustand'

interface ConnectionState {
  apiUrl: string
  token: string
  connected: boolean
  configured: boolean
  setConnection: (apiUrl: string, token: string) => void
  setConnected: (connected: boolean) => void
}

const stored = {
  apiUrl: localStorage.getItem('claw-api-url') ?? '',
  token: localStorage.getItem('claw-api-token') ?? '',
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  apiUrl: stored.apiUrl,
  token: stored.token,
  connected: false,
  configured: stored.apiUrl !== '',
  setConnection: (apiUrl, token) => {
    localStorage.setItem('claw-api-url', apiUrl)
    localStorage.setItem('claw-api-token', token)
    set({ apiUrl, token, configured: true })
  },
  setConnected: (connected) => set({ connected }),
}))
