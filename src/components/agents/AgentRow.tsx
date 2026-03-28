import type { Instance } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { TransportBadge } from '@/components/common/TransportBadge'

export function AgentRow({ instance }: { instance: Instance }) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-3 font-mono text-xs">{instance.id}</td>
      <td className="p-3 text-sm">{instance.arch}</td>
      <td className="p-3 text-sm">
        <span className="flex items-center gap-2">
          {instance.group}
          <TransportBadge jid={instance.jid} />
          {instance.is_main && <Badge variant="default" className="text-[10px]">main</Badge>}
        </span>
      </td>
      <td className="p-3">
        <Badge variant={instance.state === 'running' ? 'pass' : 'warn'}>
          {instance.state}
        </Badge>
      </td>
      <td className="p-3 text-sm text-muted-foreground">{instance.age}</td>
    </tr>
  )
}
