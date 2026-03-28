import { useQuery } from '@tanstack/react-query'
import { fetchJSON, type Group } from '@/lib/api'
import { GroupCard } from './GroupCard'

export function GroupList() {
  const { data, error } = useQuery({
    queryKey: ['groups'],
    queryFn: () => fetchJSON<{ groups: Group[] }>('/api/v1/groups'),
  })

  const groups = data?.groups ?? []

  return (
    <div>
      {error && <p className="text-sm text-fail mb-3">{(error as Error).message}</p>}
      {groups.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No groups found.</p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {groups.map((g) => (
          <GroupCard key={`${g.arch}:${g.folder}`} group={g} />
        ))}
      </div>
    </div>
  )
}
