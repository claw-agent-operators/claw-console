import { useState } from 'react'
import { fetchJSON, Session } from '../api'
import { GroupPicker } from './GroupPicker'

export function SessionsView() {
  const [group, setGroup] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState('')

  const load = (g: string, a: string) => {
    setGroup(g)
    fetchJSON<{ sessions: Session[] }>(`/api/v1/sessions?arch=${a}&group=${g}`)
      .then((d) => { setSessions(d.sessions ?? []); setError('') })
      .catch((e) => setError(e.message))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Sessions</h2>
        <GroupPicker value={group} onChange={load} />
      </div>
      {error && <p style={{ color: '#e44' }}>{error}</p>}
      {!group && <p style={{ color: '#888' }}>Select a group to view sessions.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          {sessions.length > 0 && (
            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Session</th>
              <th style={{ padding: '0.5rem' }}>Last Active</th>
              <th style={{ padding: '0.5rem' }}>Messages</th>
              <th style={{ padding: '0.5rem' }}>Summary</th>
            </tr>
          )}
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.session_id} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>{s.session_id}</td>
              <td style={{ padding: '0.5rem', color: '#888' }}>{new Date(s.last_active).toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{s.message_count}</td>
              <td style={{ padding: '0.5rem', color: '#aaa', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
