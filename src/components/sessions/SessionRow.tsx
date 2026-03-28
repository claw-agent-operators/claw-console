import type { Session } from '@/lib/api'

export function SessionRow({ session }: { session: Session }) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-3 font-mono text-xs">{session.session_id}</td>
      <td className="p-3 text-sm text-muted-foreground">{new Date(session.last_active).toLocaleString()}</td>
      <td className="p-3 text-sm">{session.message_count}</td>
      <td className="p-3 text-sm text-muted-foreground max-w-md truncate">{session.summary}</td>
    </tr>
  )
}
