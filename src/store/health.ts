import { create } from 'zustand'

export interface HealthCheck {
  arch: string
  name: string
  status: 'pass' | 'warn' | 'fail'
  detail: string
  remediation?: string
  ts?: string
}

interface HealthState {
  checks: HealthCheck[]
  upsertCheck: (check: HealthCheck) => void
  clear: () => void
}

export const useHealthStore = create<HealthState>((set) => ({
  checks: [],
  upsertCheck: (check) =>
    set((state) => {
      const key = `${check.arch}:${check.name}`
      const next = state.checks.filter((c) => `${c.arch}:${c.name}` !== key)
      next.push(check)
      return { checks: next }
    }),
  clear: () => set({ checks: [] }),
}))
