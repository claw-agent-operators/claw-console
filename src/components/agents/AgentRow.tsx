import type { Instance } from '@/lib/api'
import { Badge } from '@/components/ui/badge'

export function AgentRow({ instance }: { instance: Instance }) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-3 font-mono text-xs">{instance.id}</td>
      <td className="p-3 text-sm">{instance.arch}</td>
      <td className="p-3 text-sm">
        {instance.group}
        {instance.is_main && <Badge variant="default" className="ml-2 text-[10px]">main</Badge>}
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
