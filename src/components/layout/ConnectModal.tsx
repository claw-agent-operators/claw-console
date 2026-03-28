import { useState } from 'react'
import { useConnectionStore } from '@/store/connection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ConnectModal() {
  const { setConnection } = useConnectionStore()
  const [url, setUrl] = useState('http://localhost:7474')
  const [token, setToken] = useState('')

  const connect = () => {
    const clean = url.replace(/\/+$/, '')
    setConnection(clean, token)
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Connect to claw api</h2>
          <p className="text-sm text-muted-foreground">Enter the URL of your claw api server.</p>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="http://localhost:7474"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && connect()}
          />
          <Input
            placeholder="Bearer token (optional)"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && connect()}
          />
          <Button onClick={connect} className="w-full">
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}
