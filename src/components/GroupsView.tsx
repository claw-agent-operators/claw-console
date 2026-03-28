import { useEffect, useState } from 'react'
import { fetchJSON, Group } from '../api'

export function GroupsView() {
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJSON<{ groups: Group[] }>('/api/v1/groups')
      .then((d) => { setGroups(d.groups ?? []); setError('') })
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div>
      <h2 style={{ margin: '0 0 1rem' }}>Groups</h2>
      {error && <p style={{ color: '#e44' }}>{error}</p>}
      {groups.length === 0 && !error && <p style={{ color: '#888' }}>No groups found.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          {groups.length > 0 && (
            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>Folder</th>
              <th style={{ padding: '0.5rem' }}>Arch</th>
              <th style={{ padding: '0.5rem' }}>Trigger</th>
              <th style={{ padding: '0.5rem' }}>Flags</th>
            </tr>
          )}
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={`${g.arch}:${g.folder}`} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '0.5rem' }}>{g.name}</td>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>{g.folder}</td>
              <td style={{ padding: '0.5rem' }}>{g.arch}</td>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#aaa' }}>{g.trigger}</td>
              <td style={{ padding: '0.5rem' }}>
                {g.is_main && <span style={{ color: '#6cf', fontSize: '0.75rem', marginRight: 6 }}>main</span>}
                {!g.requires_trigger && <span style={{ color: '#888', fontSize: '0.75rem' }}>no-trigger</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
