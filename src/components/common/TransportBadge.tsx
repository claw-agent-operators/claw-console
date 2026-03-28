import { transportFromJID } from '@/lib/jid'

const BADGE_STYLES: Record<string, { label: string; icon: string; style: React.CSSProperties }> = {
  whatsapp: { label: 'WhatsApp', icon: '💬', style: { background: '#16a34a' } },
  telegram: { label: 'Telegram', icon: '✈️', style: { background: '#3b82f6' } },
  signal:   { label: 'Signal',   icon: '🔒', style: { background: '#4f46e5' } },
  discord:  { label: 'Discord',  icon: '🎮', style: { background: '#9333ea' } },
}

export function TransportBadge({ jid }: { jid: string }) {
  if (!jid) return null
  const transport = transportFromJID(jid)
  const meta = BADGE_STYLES[transport]
  if (!meta) return null

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
      style={meta.style}
    >
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  )
}
