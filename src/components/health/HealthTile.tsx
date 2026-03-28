import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { HealthCheck } from '@/store/health'
import { cn } from '@/lib/utils'

export function HealthTile({ check }: { check: HealthCheck }) {
  return (
    <Card className={cn(
      check.status === 'fail' && 'border-fail/50',
      check.status === 'warn' && 'border-warn/50',
    )}>
      <CardHeader className="flex-row items-center justify-between pb-1 space-y-0">
        <span className="font-mono text-sm">{check.name}</span>
        <Badge variant={check.status}>{check.status.toUpperCase()}</Badge>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {check.detail}
        {check.remediation && (
          <p className="mt-1 text-xs text-warn">{check.remediation}</p>
        )}
      </CardContent>
    </Card>
  )
}
