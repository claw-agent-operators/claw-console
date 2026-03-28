export type Transport = 'whatsapp' | 'telegram' | 'signal' | 'discord' | 'unknown'

export function transportFromJID(jid: string): Transport {
  if (jid.startsWith('tg:')) return 'telegram'
  if (jid.startsWith('signal:')) return 'signal'
  if (jid.startsWith('dc:')) return 'discord'
  if (jid.endsWith('@g.us') || jid.endsWith('@s.whatsapp.net')) return 'whatsapp'
  return 'unknown'
}

export const TRANSPORT_META: Record<Transport, { label: string; color: string; icon: string }> = {
  whatsapp: { label: 'WhatsApp', color: 'bg-green-600', icon: '💬' },
  telegram: { label: 'Telegram', color: 'bg-blue-500', icon: '✈️' },
  signal: { label: 'Signal', color: 'bg-indigo-600', icon: '🔒' },
  discord: { label: 'Discord', color: 'bg-purple-600', icon: '🎮' },
  unknown: { label: 'Unknown', color: 'bg-gray-400', icon: '?' },
}
