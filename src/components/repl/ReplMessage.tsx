import { cn } from '@/lib/utils'

interface Props {
  role: 'user' | 'assistant'
  text: string
}

export function ReplMessage({ role, text }: Props) {
  return (
    <div className="mb-4">
      <div className={cn('text-xs font-semibold mb-1', role === 'user' ? 'text-foreground' : 'text-primary')}>
        {role === 'user' ? 'You' : 'Agent'}
      </div>
      <div className="text-sm whitespace-pre-wrap text-foreground/90">{text}</div>
    </div>
  )
}
