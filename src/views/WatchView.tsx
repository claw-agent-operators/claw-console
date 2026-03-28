import { WatchFeed } from '@/components/watch/WatchFeed'

export function WatchView() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Watch</h2>
      <WatchFeed />
    </div>
  )
}
