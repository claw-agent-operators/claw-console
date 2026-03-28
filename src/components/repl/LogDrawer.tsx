import { useEffect, useRef, useState } from 'react'
import { createWS } from '@/lib/ws'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  group: string
  arch: string
  open: boolean
  onToggle: () => void
}

interface LogLine {
  text: string
  timestamp: string
  stream: string
}

export function LogDrawer({ group, arch, open, onToggle }: Props) {
  const [lines, setLines] = useState<LogLine[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!group || !open) return
    setLines([]) // eslint-disable-line react-hooks/set-state-in-effect -- intentional reset
    const ws = createWS(`/ws/logs/${group}?arch=${arch}`, (msg) => {
      if (msg.type === 'log_line') {
        setLines((prev) => {
          const next = [...prev, msg as unknown as LogLine]
          return next.length > 500 ? next.slice(-500) : next
        })
      }
    })
    return () => ws.close()
  }, [group, arch, open])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines, open])

  return (
    <div className="border-t border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="w-full justify-start text-xs text-muted-foreground h-7 rounded-none"
      >
        {open ? '▾' : '▸'} Logs
        {lines.length > 0 && <span className="ml-1 text-[10px]">({lines.length})</span>}
      </Button>
      {open && (
        <div className="h-48 overflow-auto bg-background/50 p-2">
          {!group && <p className="text-xs text-muted-foreground">Select a group first.</p>}
          {group && lines.length === 0 && (
            <p className="text-xs text-muted-foreground">Waiting for logs...</p>
          )}
          {lines.map((line, i) => (
            <div key={i} className="font-mono text-[11px] leading-relaxed">
              <span className="text-muted-foreground mr-2">
                {new Date(line.timestamp).toLocaleTimeString()}
              </span>
              <span className={cn(
                line.stream === 'stderr' ? 'text-warn' : 'text-muted-foreground',
              )}>
                {line.text}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
