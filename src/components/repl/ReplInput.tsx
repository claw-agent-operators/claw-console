import { useState, type KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export function ReplInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return
    onSend(text)
    setInput('')
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Send a prompt..."
        disabled={disabled}
        className="font-mono text-sm"
      />
      <Button onClick={send} disabled={disabled || !input.trim()} variant="secondary">
        Send
      </Button>
    </div>
  )
}
