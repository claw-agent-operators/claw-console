import { useEffect, useState } from 'react'
import { fetchJSON, Group } from '../api'

interface Props {
  value: string
  onChange: (group: string, arch: string) => void
}

export function GroupPicker({ value, onChange }: Props) {
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    fetchJSON<{ groups: Group[] }>('/api/v1/groups')
      .then((d) => setGroups(d.groups ?? []))
      .catch(() => {})
  }, [])

  return (
    <select
      value={value}
      onChange={(e) => {
        const g = groups.find((g) => g.folder === e.target.value)
        if (g) onChange(g.folder, g.arch)
      }}
      style={{ background: '#222', color: '#eee', border: '1px solid #444', borderRadius: 4, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
    >
      <option value="">Select group...</option>
      {groups.map((g) => (
        <option key={`${g.arch}:${g.folder}`} value={g.folder}>
          {g.name} ({g.arch})
        </option>
      ))}
    </select>
  )
}
