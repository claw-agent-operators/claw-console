import type { Group } from '@/lib/api'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TransportBadge } from '@/components/common/TransportBadge'

export function GroupCard({ group }: { group: Group }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-1 space-y-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{group.name}</span>
          <TransportBadge jid={group.jid} />
        </div>
        <div className="flex gap-1.5">
          <Badge variant="outline">{group.arch}</Badge>
          {group.is_main && <Badge variant="default">main</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-xs text-muted-foreground">
        <p className="font-mono">{group.folder}</p>
        {group.trigger && <p>trigger: <span className="text-foreground">{group.trigger}</span></p>}
      </CardContent>
    </Card>
  )
}
