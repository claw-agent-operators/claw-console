import { useQuery } from '@tanstack/react-query'
import { fetchJSON, type Instance } from '@/lib/api'
import { AgentRow } from './AgentRow'

export function AgentList() {
  const { data, error } = useQuery({
    queryKey: ['ps'],
    queryFn: () => fetchJSON<{ instances: Instance[] }>('/api/v1/ps'),
    refetchInterval: 5000,
  })

  const instances = data?.instances ?? []

  return (
    <div>
      {error && <p className="text-sm text-fail mb-3">{(error as Error).message}</p>}
      {instances.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No running agents.</p>
      )}
      {instances.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Arch</th>
              <th className="p-3 font-medium">Group</th>
              <th className="p-3 font-medium">State</th>
              <th className="p-3 font-medium">Age</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((inst) => (
              <AgentRow key={inst.id} instance={inst} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
