import { transportFromJID, TRANSPORT_META } from '@/lib/jid'
import { cn } from '@/lib/utils'

export function TransportBadge({ jid }: { jid: string }) {
  if (!jid) return null
  const transport = transportFromJID(jid)
  if (transport === 'unknown') return null
  const meta = TRANSPORT_META[transport]

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white', meta.color)}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  )
}
