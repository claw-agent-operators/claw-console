import { useQuery } from '@tanstack/react-query'
import { fetchJSON, type Group } from '@/lib/api'

interface Props {
  value: string
  onChange: (group: string, arch: string) => void
}

export function GroupPicker({ value, onChange }: Props) {
  const { data } = useQuery({
    queryKey: ['groups'],
    queryFn: () => fetchJSON<{ groups: Group[] }>('/api/v1/groups'),
  })

  const groups = data?.groups ?? []

  return (
    <select
      value={value}
      onChange={(e) => {
        const g = groups.find((g) => g.folder === e.target.value)
        if (g) onChange(g.folder, g.arch)
      }}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
