import type { Group } from '@/lib/api'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function GroupCard({ group }: { group: Group }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-1 space-y-0">
        <span className="font-medium text-sm">{group.name}</span>
        <div className="flex gap-1.5">
          <Badge variant="outline">{group.arch}</Badge>
          {group.is_main && <Badge variant="default">main</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-xs text-muted-foreground">
        <p className="font-mono">{group.folder}</p>
        {group.trigger && <p>trigger: <span className="text-foreground">{group.trigger}</span></p>}
        {group.jid && <p className="font-mono truncate">{group.jid}</p>}
      </CardContent>
    </Card>
  )
}
