import { SessionList } from '@/components/sessions/SessionList'

export function SessionsView() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Sessions</h2>
      <SessionList />
    </div>
  )
}
