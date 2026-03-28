import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchJSON, type Session } from '@/lib/api'
import { GroupPicker } from '@/components/watch/GroupPicker'
import { SessionRow } from './SessionRow'

export function SessionList() {
  const [group, setGroup] = useState('')
  const [arch, setArch] = useState('')

  const { data, error } = useQuery({
    queryKey: ['sessions', arch, group],
    queryFn: () => fetchJSON<{ sessions: Session[] }>(`/api/v1/sessions?arch=${arch}&group=${group}`),
    enabled: !!group && !!arch,
  })

  const sessions = data?.sessions ?? []

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <GroupPicker value={group} onChange={(g, a) => { setGroup(g); setArch(a) }} />
      </div>
      {error && <p className="text-sm text-fail mb-3">{(error as Error).message}</p>}
      {!group && <p className="text-sm text-muted-foreground">Select a group to view sessions.</p>}
      {sessions.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Session</th>
              <th className="p-3 font-medium">Last Active</th>
              <th className="p-3 font-medium">Messages</th>
              <th className="p-3 font-medium">Summary</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <SessionRow key={s.session_id} session={s} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
