import { LogFeed } from '@/components/logs/LogFeed'

export function LogsView() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Logs</h2>
      <LogFeed />
    </div>
  )
}
