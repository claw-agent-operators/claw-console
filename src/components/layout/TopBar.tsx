import { useConnectionStore } from '@/store/connection'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { connected, apiUrl } = useConnectionStore()

  return (
    <header className="h-12 border-b border-border flex items-center justify-between px-4">
      <div />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-pass' : 'bg-fail')} />
        {apiUrl || 'localhost:7474'}
      </div>
    </header>
  )
}
