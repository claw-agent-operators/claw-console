import { useEffect, useState } from 'react'
import { fetchJSON, Instance } from '../api'

export function AgentsView() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = () => {
      fetchJSON<{ instances: Instance[] }>('/api/v1/ps')
        .then((d) => { setInstances(d.instances ?? []); setError('') })
        .catch((e) => setError(e.message))
    }
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <h2 style={{ margin: '0 0 1rem' }}>Agents</h2>
      {error && <p style={{ color: '#e44' }}>{error}</p>}
      {instances.length === 0 && !error && <p style={{ color: '#888' }}>No running agents.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>ID</th>
            <th style={{ padding: '0.5rem' }}>Arch</th>
            <th style={{ padding: '0.5rem' }}>Group</th>
            <th style={{ padding: '0.5rem' }}>State</th>
            <th style={{ padding: '0.5rem' }}>Age</th>
          </tr>
        </thead>
        <tbody>
          {instances.map((inst) => (
            <tr key={inst.id} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{inst.id}</td>
              <td style={{ padding: '0.5rem' }}>{inst.arch}</td>
              <td style={{ padding: '0.5rem' }}>{inst.group}{inst.is_main && <span style={{ marginLeft: 6, color: '#6cf', fontSize: '0.75rem' }}>main</span>}</td>
              <td style={{ padding: '0.5rem', color: inst.state === 'running' ? '#4c4' : '#ea4' }}>{inst.state}</td>
              <td style={{ padding: '0.5rem', color: '#888' }}>{inst.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
